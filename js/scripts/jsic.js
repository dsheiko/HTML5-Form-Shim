/**
 * js-import-compiler
 *
 * Look for dependencies recursively in source file and
 * resolve them in compiled destination file
 *
 * Dependency annotation:
 * var ValidationLogger = $import("./Form/ValidationLogger"),..
 *
 * @package JS Import Compiler
 * @author sheiko
 * @license MIT
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */

(function(){
var fs = require('fs'),
    path = require('path'),
    helpScreen = "Usage: jsic <src-path> <dest-path>\n" +
                "<src-path> - filename\n" +
                "<dest-path> - filename\n",

    Compiler = function() {
        var deps = [],
            jsRequireMatchRe = /\$import\([\"\'](.*?)[\"\']\)/gmi;
        return {
            /**
             *
             * @public
             * @memberof Compiler
             * @param {string} srcFile
             * @param {string} destFile
             */
            compile: function( srcFile, destFile ) {
                var srcData;
                if ( !fs.existsSync( srcFile ) ) {
                    console.error(  "Source file " + srcFile + " not found" );
                    process.exit( 1 );
                }
                srcData = fs.readFileSync( srcFile, 'utf-8' );
                srcData = this.processSource( srcData, path.dirname( srcFile ) );
                fs.writeFileSync( destFile, srcData, 'utf-8' );
            },
            /**
             *
             * @private
             * @memberof Compiler
             * @param {string} dep
             * @return {boolean}
             */
            isResolved: function( dep ) {
                if ( deps.indexOf( dep ) !== -1 ) {
                    // already resolved
                    return true;
                }
                deps.push( dep );
                return false;
            },
           /**
            * Look for dependencies in a given data and resolve them
            *
            * @private
            * @memberof Compiler
            * @param {string} srcData
            * @param {string} srcPath (as root path for dependency links)
            * @return {string}
            */
            processSource: function( srcData, srcPath ) {
                var that = this,
                    matches;
                matches = srcData.match( jsRequireMatchRe );
                matches && matches.forEach(function( match ){
                    var re = /\$import\([\"\'](.*?)[\"\']\)/i,
                        depPathMatch = re.exec( match ),
                        // Get relative path
                        depFile = path.join( srcPath, depPathMatch[ 1 ]),
                        reqData;;
                    if ( !that.isResolved( depFile ) ) {
                        reqData = that.processDependency( depFile );
                        srcData = srcData.replace( match, reqData );
                        srcData = that.processSource( srcData, srcPath );
                    } else {
                        // If resolved, just remove $import(..)
                        // @TODO remove with var identifier = $import...
                        srcData = srcData.replace( match, "" );
                    }
                });
                return srcData;
            },

           /**
            * Read dependency content and normalize it
            *
            * @private
            * @memberof Compiler
            * @param {string} srcFile
            * @return {string}
            */
            processDependency: function( srcFile ) {
                var srcData,
                    re = /\.js$/i;
                 // Relative path can be "dir/file" or "dir/file.js"
                re.test( srcFile ) || ( srcFile += ".js" );
                if ( !fs.existsSync( srcFile ) ) {
                    console.error( "Imported file " + srcFile + " not found" );
                    process.exit( 1 );
                }
                srcData = fs.readFileSync( srcFile, 'utf-8' );
                // Remove exports.Name from the source
                return " " + srcData
                    // Trim source
                    .replace(/^\s*/g, "")
                    .replace(/;?\s*$/g, "");
            }
        };
    },
    /** @var {object} Compiler instance */
    runner;


if ( process.argv.length < 4 ) {
    console.log( helpScreen );
    process.exit( 0 );
}

runner = new Compiler();
runner.compile(process.argv[ 2 ], process.argv[ 3 ]);

}());