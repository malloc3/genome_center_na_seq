# RNA_QC

Documentation here. Start with a paragraph, not a heading or title, as in most views, the title will be supplied by the view.
### Inputs


- **Input Array** [IS] (Array) Part of collection
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
needs "Collection_Management/CollectionDisplay"
needs "Collection_Management/CollectionTransfer"
needs "Collection_Management/CollectionActions"
needs "Collection_Management/SampleManagement"
needs "RNA_Seq/WorkflowValidation"
needs "RNA_Seq/KeywordLib"


class Protocol
  include Debug, CollectionDisplay, CollectionTransfer, SampleManagement
  include CollectionActions, WorkflowValidation, CommonInputOutputNames, KeywordLib

  TRANSFER_VOL = 20   #volume of sample to be transfered in ul


  def main
    validate_inputs(operations)
    working_plate = Collection.new_collection(C_TYPE)
    show do
      title "Get and Lable Working Plate"
      note "Get a <b>#{C_TYPE}</b> and lable ID: <b>#{working_plate.id}</b>"
    end
    
    operations.retrieve

    operations.each do |op|
      input_fv_array = op.input_array(INPUT_ARRAY)
      add_fv_array_samples_to_collection(input_fv_array, working_plate)
      transfer_from_array_collections(input_fv_array, working_plate, TRANSFER_VOL)
    end
    
    store_input_collections(operations)
    take_qc_measurments(working_plate)
    trash_object(working_plate)

  end


  # Instruction on taking the QC measurements themselves.
  # Currently not operational but associates random concentrations for testing
  #
  #TODO complete this and make it actually look at CSV Files
  def take_qc_measurments(working_plate)
    input_rcx = []
    operations.each do |op|
      input_array = op.input_array(INPUT_ARRAY)
      input_items = input_array.map{|fv| fv.item}
      arry_sample = input_array.map{|fv| fv.sample}
      input_items.each_with_index do |item, idx|
        item.associate(CON_KEY, rand(50..100))
        sample = arry_sample[idx]
        working_plate_loc_array = working_plate.find(sample)
        working_plate_loc_array.each do |sub_array|
          sub_array.push("#{item.get(CON_KEY)}")
          input_rcx.push(sub_array)
        end
      end
    end

    show do
      title "Perform QC Measurements"
      note "Please Attach excel files"
      note "For testing purposes each sample will be given a random concentration from 50 to 100 ng/ul"
      note "This will eventually come from a CSV file"
      table highlight_rcx(working_plate, input_rcx)
    end
  end
end

```