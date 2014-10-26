/**
* create html files
* @param {Object} self - 'this' object
* @param {string} templatesFolder - templates folder
* @param {Array.<string>} templates
* @param {string} layoutsFolder - layouts folder
* @param {string} targetFolder - target folder
* @param {string} partialsFolder - partials folder
*/
var createHtmlFiles = function(self, templatesFolder, templates, layoutsFolder, targetFolder, partialsFolder){

	var template
		,html = ''
		,targetPath = '';
	
	for(var i=0; i<templates.length; i++){
	
		//get template
		template = templates[i];
		
		//render html
		html = self.blissObj.render(templatesFolder + '/' + template, {
			layoutsFolder: layoutsFolder
			,partialsFolder: partialsFolder
		});
		
		//init target path 
		targetPath = targetFolder + '/' + template;
				
		//write file		
		self.fs['writeFileSync'](targetPath, html.trim(), 'utf8');
	}
};

/**
* entry point
*/
var init = (function(){
	
	var self = {
	
		//libs
		fs: require('fs')
		,path: require('path')
		,bliss: require('bliss')
		
		//folders
		,templatesFolder: ''
		,layoutsFolder: ''
		,targetFolder: ''
		,partialsFolder: ''
				
		,packageJson: null
		,templates: []		
		,blissObj: null		
	};
	
	//init bliss object
	self.blissObj = new self.bliss({
		cacheEnabled: false
	});
	
	//load package.json
	self.packageJson = JSON.parse(self.fs.readFileSync('package.json', 'utf8')); 
	
	//get templates from package.json
	self.templates = self.packageJson['templates'];
	
	//get templates folder
	self.templatesFolder = __dirname + '/' + self.packageJson['templates-folder'];
	
	//get layouts folder
	self.layoutsFolder = __dirname + '/' + self.packageJson['layouts-folder'];
	
	//get target folder
	self.targetFolder = __dirname + '/' + self.packageJson['target-folder'];
	
	//get partials folder
	self.partialsFolder = __dirname + '/' + self.packageJson['partials-folder'];
	
	//create html files
	createHtmlFiles(self, self.templatesFolder, self.templates, self.layoutsFolder, self.targetFolder, self.partialsFolder);
	
})();