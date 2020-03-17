# RNA_Prep

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
needs "Collection_Management/CollectionDisplay"
needs "Collection_Management/CollectionTransfer"
needs "Collection_Management/CollectionActions"
needs "Collection_Management/SampleManagement"
needs "RNA_Seq/WorkflowValidation"
needs "RNA_Seq/KeywordLib"

class Protocol
  include Debug, CollectionDisplay, CollectionTransfer, SampleManagement, CollectionActions
  include WorkflowValidation, CommonInputOutputNames, KeywordLib
  C_TYPE = "96 Well Sample Plate"
  CON_KEY = "Stock Conc (ng/ul)"

  TRANSFER_VOL = 20   #volume of sample to be transfered in ul
  CONC_RANGE = (50...100)


  def main

    validate_inputs(operations, inputs_match_outputs = true)

    validate_concentrations(operations, CONC_RANGE)

    working_plate = Collection.new_collection(C_TYPE)
    show do
      title "Get and Label Working Plate"
      note "Get a <b>#{C_TYPE}</b> and lable ID: <b>#{working_plate.id}</b>"
    end

    operations.retrieve

    operations.each do |op|
      input_fv_array = op.input_array(INPUT_ARRAY)
      output_fv_array = op.output_array(OUTPUT_ARRAY)
      add_fv_array_samples_to_collection(input_fv_array, working_plate)
      make_output_plate(output_fv_array, working_plate)
      transfer_from_array_collections(input_fv_array, working_plate, TRANSFER_VOL)
    end

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
      table highlight_non_empty(working_plate)
    end
  end
end

```
