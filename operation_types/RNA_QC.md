# RNA QC

Documentation here. Start with a paragraph, not a heading or title, as in most views, the title will be supplied by the view.
### Inputs


- **Input Array** [IS] (Array) 
  - <a href='#' onclick='easy_select("Sample Types", "RNA Sample")'>RNA Sample</a> / <a href='#' onclick='easy_select("Containers", "Total RNA 96 Well Plate")'>Total RNA 96 Well Plate</a>





### Precondition <a href='#' id='precondition'>[hide]</a>
```ruby
def precondition(_op)
  true
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

require 'csv'

class Protocol
  include Debug, CollectionDisplay, CollectionTransfer, SampleManagement
  include CollectionActions, WorkflowValidation, CommonInputOutputNames
  include KeywordLib, UploadHelper

  TRANSFER_VOL = 20   #volume of sample to be transfered in ul
  CSV_HEADERS = ["Well Position", "Conc(ng/ul)"]
  CSV_LOCATION = "TBD Location of file"

  def main

    validate_inputs(operations)
    
    working_plate = make_new_plate(C_TYPE)
    
    operations.retrieve

    operations.each do |op|
      input_fv_array = op.input_array(INPUT_ARRAY)
      add_fv_array_samples_to_collection(input_fv_array, working_plate)
      transfer_from_array_collections(input_fv_array, working_plate, TRANSFER_VOL)
    end
    
    store_input_collections(operations)
    take_qc_measurments(working_plate)
    list_concentrations(working_plate)
    trash_object(working_plate)
  end


  


  # Instruction on taking the QC measurements themselves.
  # Currently not operational but associates random concentrations for testing
  #
  #@param working_plate collection the plate being used
  def take_qc_measurments(working_plate)
    show do
      title "Load Plate #{working_plate.id} on Plate Reader"
      note "Load plate on plate reader and take concentration measurements"
      note "Save output data as CSV and upload on next page"
    end

    csv_uploads = get_validated_uploads(working_plate.parts.length, 
        CSV_HEADERS, false, file_location: CSV_LOCATION)

    upload = csv_uploads.first
    csv = CSV.read(open(upload.url))
    conc_idx = csv.first.find_index(CSV_HEADERS[1])
    loc_idx = csv.first.find_index(CSV_HEADERS[0])
    csv.drop(1).each_with_index do |row, idx|
      alpha_loc = row[loc_idx]
      conc = row[conc_idx].to_i
      part = part_alpha_num(working_plate, alpha_loc)
      if !part.nil?
        part.associate(CON_KEY, conc)
        samp = part.sample
        operations.each do |op|
          op.input_array(INPUT_ARRAY).each do |fv|
            if samp == fv.sample
              fv.part.associate(CON_KEY, conc)
            end
          end
        end
      end
    end
  end


  #Lists the measured concentrations.
  #TODO write highlight heat map method for table
  #
  #@param working_plate collection the plate being used
  def list_concentrations(working_plate)
    rcx_array = []
    parts = working_plate.parts
    parts.each do |part|
      loc_array = working_plate.find(part)
      loc_array.each do |loc|
        loc.push(part.get(CON_KEY))
        rcx_array.push(loc)
      end
    end
    show do
      title "Measurements Take"
      note "Recorded Concentrations are listed below"
      table highlight_rcx(working_plate, rcx_array, check: false)
    end
  end
end

```
