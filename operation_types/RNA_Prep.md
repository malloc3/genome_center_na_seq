# RNA Prep

Documentation here. Start with a paragraph, not a heading or title, as in most views, the title will be supplied by the view.
### Inputs


- **Input Array** [R] (Array) 
  - <a href='#' onclick='easy_select("Sample Types", "RNA Sample")'>RNA Sample</a> / <a href='#' onclick='easy_select("Containers", "Total RNA 96 Well Plate")'>Total RNA 96 Well Plate</a>



### Outputs


- **Output Array** [R] (Array) 
  - <a href='#' onclick='easy_select("Sample Types", "RNA Sample")'>RNA Sample</a> / <a href='#' onclick='easy_select("Containers", "96 Well Sample Plate")'>96 Well Sample Plate</a>

### Precondition <a href='#' id='precondition'>[hide]</a>
```ruby
def precondition(_op)
  true
  #_op = Operation.find(_op)
  #_op.associate("Run_Pre".to_sym, "Ayy the preconditions ran")
end
```

### Protocol Code <a href='#' id='protocol'>[hide]</a>
```ruby
#Cannon Mallory
#UW-BIOFAB
#03/04/2019
#malloc3@uw.edu
#
#
#This protocol is for total RNA QC.  It Will take in a batch of samples, replate these
#samples together onto a 96 well plate that will then go through a QC protocols including
#getting the concentrations of the original sampole.  These concentrations will then be associated
#with the original sample for use later.


#Currently build plate needs a bit of work.  It works by order of input array and not by order of sample location on plate


needs "Standard Libs/Debug"
needs "Standard Libs/CommonInputOutputNames"
needs "Standard Libs/Units"
needs "Standard Libs/UploadHelper"

needs "Collection_Management/CollectionDisplay"
needs "Collection_Management/CollectionTransfer"
needs "Collection_Management/CollectionActions"
needs "Collection_Management/SampleManagement"
needs "RNA_Seq/WorkflowValidation"
needs "RNA_Seq/KeywordLib"
needs "RNA_Seq/CsvDebugLib"

require 'csv'

class Protocol
  include Debug, CollectionDisplay, CollectionTransfer, SampleManagement
  include WorkflowValidation, CommonInputOutputNames, KeywordLib, CsvDebugLib
  include CollectionActions, UploadHelper


  PLATE_ID = "Plate ID"
  WELL_LOCATION = "Well Location"
  ADAPTER_TRANSFER_VOL = 12 #volume of adapter to transfer
  TRANSFER_VOL = 20   #volume of sample to be transfered in ul
  CONC_RANGE = (0...100)
  CSV_HEADERS = ["Plate ID", "Well Location"]
  CSV_LOCATION = "Location TBD"


  def main

    validate_inputs(operations, inputs_match_outputs = true)

    validate_concentrations(operations, CONC_RANGE)

    working_plate = make_new_plate(C_TYPE)

    operations.retrieve

    operations.each do |op|
      input_fv_array = op.input_array(INPUT_ARRAY)
      output_fv_array = op.output_array(OUTPUT_ARRAY)
      add_fv_array_samples_to_collection(input_fv_array, working_plate)
      make_output_plate(output_fv_array, working_plate)
      transfer_from_array_collections(input_fv_array, working_plate, TRANSFER_VOL)
    end

    adapter_plate = make_adapter_plate(working_plate.parts.length)

    associate_plate_to_plate(working_plate, adapter_plate, ADAPTER_PLATE, ADAPTER)

    store_input_collections(operations)
    rna_prep_steps(working_plate)
    store_output_collections(operations, 'Freezer')
  end

  #Instructions for performing RNA_PREP
  #
  # @working_plate collection the plate that has all samples in it
  def rna_prep_steps(working_plate)
    show do
      title "Run RNA-Prep"
      note "Run typical RNA-Prep Protocol with plate #{working_plate.id}"
      table highlight_non_empty(working_plate, check: false)
    end
  end


  #Instructions for making an adapter plate
  #
  #returns:
  # @adapter_plate collection the adapter plate
  def make_adapter_plate(num_adapters_needed)
    adapter_plate = make_new_plate(C_TYPE)

    show do
      title "Upload CSV"
      note "On the next page upload CSV of desired Adapters"
    end

    up_csv = get_validated_uploads(num_adapters_needed, CSV_HEADERS, false, file_location: CSV_LOCATION)
    col_parts_hash = sample_from_csv(up_csv)
    col_parts_hash.each do |collection_item, parts|
      collection = Collection.find(collection_item.id)
      adapter_plate.add_samples(parts)
      transfer_to_working_plate(collection, adapter_plate, arry_sample = parts, ADAPTER_TRANSFER_VOL)
    end
    return adapter_plate
  end

  #Parses CSV and returns an array of all the samples required
  #@ CSV  CSV a csv file of thee adapter plate wells
  #
  #returns hash[key: collection, array[parts]]
  def sample_from_csv(csv_uploads)
    parts = []
    csv = CSV.parse(csv_upload) if debug
    csv_uploads.each do |upload|
      csv = CSV.read(open(upload.url))

      first_row = csv.first
      #Should remove leading blank space from CSV
      first_row[0][0] = ''

      id_idx = first_row.find_index(CSV_HEADERS[0])
      loc_idx = first_row.find_index(CSV_HEADERS[1])
      csv.drop(1).each_with_index do |row, idx|
        collection = Collection.find(row[id_idx])
        part = part_alpha_num(collection, row[loc_idx])
        parts.push(part)
      end
    end
    return parts.group_by{|part| part.containing_collection}
  end
end

```
