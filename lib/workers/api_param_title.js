/**
 * PreProcess.
 *
 * @param {Object[]} parsedFiles
 * @param {String[]} filenames
 * @param {Object} packageInfos
 * @returns {Object}
 */
function preProcess(parsedFiles, filenames, packageInfos, defineStructureName)
{
    var result = {};
    defineStructureName = defineStructureName || "paramTitle";
    result[defineStructureName] = [];

    parsedFiles.forEach(function(parsedFile){
        parsedFile.forEach(function(block){
            if(block.global[defineStructureName])
            {
                var entries = block.global[defineStructureName];
                // Simple append, same Codes too.
                entries.forEach(function(entry){
                    result[defineStructureName].push(entry);
                });
                // Unset
                delete(block.global[defineStructureName]);
            }
        });
    });
    return result;
} // preProcess

/**
 * PostProcess.
 *
 * @param {Object[]} parsedFiles
 * @param {String[]} filenames
 * @param {Object[]} preProcessResults
 * @param {Object} packageInfos
 */
function postProcess(parsedFiles, filenames, preProcessResults, packageInfos, structureName, defineStructureName)
{
    structureName = structureName || "parameter";
    defineStructureName = defineStructureName || "paramTitle";

    var fields;
    var newBlock;
    var blockEntries;
    var found;
    parsedFiles.forEach(function(parsedFile){
        parsedFile.forEach(function(block){
            if(block.local[structureName] && block.local[structureName].fields)
            {
                fields = block.local[structureName].fields;
                newBlock = {}; // preserve sorting
                Object.keys(fields).forEach(function(blockKey){
                    blockEntries = block.local[structureName].fields[blockKey];
                    found = false;
                    preProcessResults[defineStructureName].forEach(function(preEntry){
                        if(preEntry.group === blockKey)
                        {
                            found = true;
                            newBlock[preEntry.title] = blockEntries;
                        }
                    });
                    if( ! found)
                    {
                        newBlock[blockKey] = blockEntries;
                    }
                });
                block.local[structureName].fields = newBlock;
            }
        });
    });

} // postProcess

/**
 * Exports.
 */
module.exports = {
	preProcess: preProcess,
	postProcess: postProcess
};