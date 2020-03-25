var config = {

  tagline: "The Laboratory</br>Operating System",
  documentation_url: "http://localhost:4000/aquarium",
  title: "Genome_Center_Rna_Seq",
  navigation: [

    {
      category: "Overview",
      contents: [
        { name: "Introduction", type: "local-md", path: "README.md" },
        { name: "About this Workflow", type: "local-md", path: "ABOUT.md" },
        { name: "License", type: "local-md", path: "LICENSE.md" },
        { name: "Issues", type: "external-link", path: 'https://github.com/malloc3/genome_center_na_seq/issues' }
      ]
    },

    

      {

        category: "Operation Types",

        contents: [

          
            {
              name: 'C_DNA_QC',
              path: 'operation_types/C_DNA_QC' + '.md',
              type: "local-md"
            },
          
            {
              name: 'Normalization Pooling',
              path: 'operation_types/Normalization_Pooling' + '.md',
              type: "local-md"
            },
          
            {
              name: 'RNA_Prep',
              path: 'operation_types/RNA_Prep' + '.md',
              type: "local-md"
            },
          
            {
              name: 'RNA_QC',
              path: 'operation_types/RNA_QC' + '.md',
              type: "local-md"
            },
          

        ]

      },

    

    

      {

        category: "Libraries",

        contents: [

          
            {
              name: 'AssociationManagement',
              path: 'libraries/AssociationManagement' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'CollectionActions',
              path: 'libraries/CollectionActions' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'CollectionDisplay',
              path: 'libraries/CollectionDisplay' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'CollectionTransfer',
              path: 'libraries/CollectionTransfer' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'CommonInputOutputNames',
              path: 'libraries/CommonInputOutputNames' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'CsvDebugLib',
              path: 'libraries/CsvDebugLib' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'Debug',
              path: 'libraries/Debug' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'KeywordLib',
              path: 'libraries/KeywordLib' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'PlanParams',
              path: 'libraries/PlanParams' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'SampleManagement',
              path: 'libraries/SampleManagement' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'Units',
              path: 'libraries/Units' + '.html',
              type: "local-webpage"
            },
          
            {
              name: 'WorkflowValidation',
              path: 'libraries/WorkflowValidation' + '.html',
              type: "local-webpage"
            },
          

        ]

    },

    

    
      { category: "Sample Types",
        contents: [
          
            {
              name: 'E coli strain',
              path: 'sample_types/E_coli_strain'  + '.md',
              type: "local-md"
            },
          
            {
              name: 'Plasmid',
              path: 'sample_types/Plasmid'  + '.md',
              type: "local-md"
            },
          
            {
              name: 'Primer',
              path: 'sample_types/Primer'  + '.md',
              type: "local-md"
            },
          
            {
              name: 'RNA Sample',
              path: 'sample_types/RNA_Sample'  + '.md',
              type: "local-md"
            },
          
        ]
      },
      { category: "Containers",
        contents: [
          
            {
              name: '96 Well Sample Plate',
              path: 'object_types/96_Well_Sample_Plate'  + '.md',
              type: "local-md"
            },
          
            {
              name: 'Fragment Stock',
              path: 'object_types/Fragment_Stock'  + '.md',
              type: "local-md"
            },
          
            {
              name: 'Total RNA 96 Well Plate',
              path: 'object_types/Total_RNA_96_Well_Plate'  + '.md',
              type: "local-md"
            },
          
        ]
      }
    

  ]

};
