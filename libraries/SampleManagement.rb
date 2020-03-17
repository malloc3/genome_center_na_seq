#Cannon Mallory
#malloc3@uw.edu
#
#This is to facilitate sample management within collection
module SampleManagement

  #Gets the location string of a sample in a collection 
  #Returns Alpha numerical string eg A1 or if the sample is
  #in multiple locations will return A1, A2, A3
  #
  #@collection Collection the collection that the sample is in
  #@sample Sample the Sample that you want the Alpha Numerical location for
  def get_alpha_num_location(collection, sample)
    loc_array = collection.find(sample)
    string = ""
    alpha26 = ("A"..."Z").to_a
    loc_array.each_with_index do |loc, idx|
      string = string + ", " if idx > 0
      loc.each_with_index do |rc, idx|
        if idx.even?
          string = string + alpha26[rc]
        else
          string = string + "#{rc+1}"
        end
      end
    end
    return string
  end


  #Assigns samples to specific well locations
  #
  #input:  working_plate   Collection
  def add_fv_array_samples_to_collection(input_array, working_plate)
      sample_array = []
      input_array = input_array.sort_by{|fv| [fv.collection.find(fv.sample).first[1],fv.collection.find(fv.sample).first[0]]}
      input_array.each_with_index do |fv, idx|
        sample = fv.sample
        sample_array << sample
      end
      slots_left = working_plate.get_empty.length
      raise "There are too many samples in this batch." if sample_array.length > slots_left
      working_plate.add_samples(sample_array) #TODO add error checking for if the working_plate is full
  end


  #This replaces the operations.make command.  It ensures that all items in output_fv_array
  #Remain in the same collection (instead of being put into different collections)
  #
  # @output_fv_array array[fv] array of field values
  # @working_plate collection the destination collection.
  def make_output_plate(output_fv_array, working_plate)
    output_fv_array.each do |fv|
        r_c = working_plate.find(fv.sample).first
        fv.set(collection: working_plate, row: r_c[0], column: r_c[1])
      end
  end

end