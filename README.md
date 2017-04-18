# Open-Neuron-Project
Displaying neural connectivity data using D3.js.

Welcome to the Open Neuron Project, the basic idea is to store connectivity data for known neuronal types in a MySQL database, then display that data graphically using data driven documentation.

A working prototype can be found here https://bl.ocks.org/OMHouston/ada82602ae73c9017cbd6495934faab8, but needs a few tweaks to make it accept and work with data from getdata.php rather than static json files.

I am open to any alternative methods of doing things, for me the priority is simplicity and speed for the end-user.

Also, if you have any questions, please ask, I am not a developer, so have probably missed some things out.

The Data is currently organised into 3 tables: Locations, Cells and Links.

locations includes areas of the brain/body, e.g. the cochlea/retina, or nuclei within the brain (lateral geniculate nucleus).
Cells includes the cell types and the location they are found, e.g. sensory hair cells are found in the cochlea, photoreceptors in the retina. (location is a foreign key reference).
Links contains the source and target of a connection (both foreign keys to the cells table).
