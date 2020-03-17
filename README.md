Cannin Mallory
malloc3@uw.edu
Univeristy of Washington

RNA-Seq Workflow

This workflow goes through a basic RNA_SEQ workflow.  It is assumed to be used by expert users thus individual steps are not explicitly explained.  The main objective is to provide object providence and item tracking though out the work flow.  This workflow is intended to utilize tools such as Menagerie to assist in planning and execution.

Below shows the basic view of a the workflow (minus a “build adapter plate”).    Each step can have up to 96 inputs and outputs.  Inputs and outputs should be same.

RNA_QC should be run before RNA_Prep and C_DNA_QC should be run before Normalization Pooling. TODO check this before job is launched.

![High Throughput Culturing Plan](images/example_plan.png?raw=true "Basic Plan")
