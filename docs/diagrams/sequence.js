var wsd = require('websequencediagrams');
var fs = require('fs');
var Path = require('path');
var async = require('async');
var src = Path.join(__dirname, 'raw');

// Diagram preferences
var THEME = 'modern-blue';
var FORMAT = 'png';

function generateDiagram(fileName, callback) {
  var rawDiagramPath = Path.join(src, fileName);
  var diagramText = fs.readFileSync(rawDiagramPath, { encoding: 'utf8' });

  wsd.diagram(diagramText, THEME, FORMAT, function(err, data) {
    if(err) {
      console.error('Failed to generate diagram for ', rawDiagramPath);
      return callback();
    }

    var diagramFileName = Path.basename(fileName, Path.extname(fileName)) + '.' + FORMAT;
    var diagramPath = Path.join(__dirname, diagramFileName);

    fs.writeFileSync(diagramPath, data);
    console.log('Created ', diagramPath);
    callback();
  });
}

async.eachSeries(fs.readdirSync(src).sort(), generateDiagram);
