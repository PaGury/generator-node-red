'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the unreal ' + chalk.blue('Node') + ' for ' + chalk.red('NodeRed') + ' generator!'
      ));

    var prompts = [
    {
      type    : 'input',
      name    : 'nodeName',
      message : 'Your node name'
    },
    {
      type    : 'input',
      name    : 'nodeDisplayName',
      message : 'Your node display name'
    },
    {
      type    : 'list',
      name    : 'category',
      message : 'The category',
      choices: [
      "input", "output", "function", "social", "storage", "analysis", "advanced"
      ]
    },
    {
      type    : 'input',
      name    : 'inputs',
      message : 'The number of inputs',
      when    : function(answers) {
        return answers.category !== "input"; 
      },
      default : 1
    },
    {
      type    : 'input',
      name    : 'outputs',
      message : 'The number of outputs',
      when    : function(answers) {
        return answers.category !== "output"; 
      },
      default : 1
    },
    {
      type    : 'input',
      name    : 'color',
      message : 'The hexadecimal color',
      default : '#333333'
    }
    ];

    this.prompt(prompts, function (props) {
      this.io = {
        inputs: props.inputs == undefined ? 0 : props.inputs,
        outputs: props.outputs == undefined ? 0 : props.outputs,
      };
      this.color = props.color;
      this.category = props.category;
      this.nodeName = props.nodeName;
      this.nodeDisplayName = props.nodeDisplayName;
      done();
    }.bind(this));
  },

  writing: {
    nodeFiles: function () {
      this.fs.copyTpl(
        this.templatePath('node.html'),
        this.destinationPath(this.nodeName + '.html'),
        this);
      this.fs.copyTpl(
        this.templatePath('node.js'),
        this.destinationPath(this.nodeName + '.js'),
        this);

      var packageJson = require(this.destinationPath('package.json'));
      packageJson["node-red"]["nodes"][this.nodeName] = this.nodeName + ".js";
      this.write(this.destinationPath('package.json'), JSON.stringify(packageJson, null, 4));
    }
  }
});
