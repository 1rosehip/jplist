;(function(){
	'use strict';

    /**
     * scan
     * @param {string} pattern
     * @param {Array.<string>} operators
     * @param {string] ignoreRegex
     * @return {Object} tree
     */
    var scan = function(pattern, operators, operatorsIndex, ignoreRegex){

        var part
            ,parts
            ,operator
            ,tree;

        if(operatorsIndex < operators.length){

            operator = operators[operatorsIndex];
            parts = pattern.split(operator);

            if(parts.length > 1){
                tree = {
                    operator: operator
                    ,nodes: parts
                };

                for(var i=0; i<tree.nodes.length; i++){

                    part = tree.nodes[i];

                    tree.nodes[i] = scan(part, operators, operatorsIndex + 1);
                }
            }
            else{
                return scan(pattern, operators, operatorsIndex + 1);
            }
        }
        else{
            return jQuery.trim(jQuery.fn.jplist.HelperService.removeCharacters(pattern, ignoreRegex));
        }

        return tree;
    };

    /**
     * operation
     * @param {Array.<string>} nodes
     * @param {string} input
     * @param {string} operator
     * @param {Array.<string>} notOperators
     * @param {Array.<string>} andOperators
     * @param {Array.<string>} orOperators
     * @return {boolean}
     */
    var operation = function(nodes, input, operator, notOperators, andOperators, orOperators){

        var contains
            ,node;

        contains = input.indexOf(nodes[0]) !== -1;

        for(var i=1; i<nodes.length; i++){

            node = nodes[i];

            if(node !== '') {

                if(notOperators.indexOf(operator) !== -1){
                    contains = contains && input.indexOf(node) === -1;
                }

                if(andOperators.indexOf(operator) !== -1){
                    contains = contains && input.indexOf(node) !== -1;
                }

                if(orOperators.indexOf(operator) !== -1){
                    contains = contains || input.indexOf(node) !== -1;
                }
            }
        }

        return contains;
    };

    /**
     * parse
     * @param {Object} tree
     * @param {string} input
     * @param {Array.<string>} notOperators
     * @param {Array.<string>} andOperators
     * @param {Array.<string>} orOperators
     * @return {boolean} contains?
     */
    var parse = function(tree, input, notOperators, andOperators, orOperators){

        var contains = true;

        if(tree.nodes){

            for(var i=0; i<tree.nodes.length; i++){
                parse(tree.nodes[i], input, notOperators, andOperators, orOperators);
            }

            contains = operation(tree.nodes, input, tree.operator, notOperators, andOperators, orOperators);
        }
        else{
            contains = input.indexOf(tree) !== -1;
        }

        return contains;
    };

    /**
     * advanced search
     * @param {string} input
     * @param {string} pattern (may contain OR, AND, NOT)
     * @param {string=} ignoreRegex
     * @param {Array.<string>=} notOperators
     * @param {Array.<string>=} andOperators
     * @param {Array.<string>=} orOperators
     * @return {boolean} contains?
     */
    jQuery.fn.jplist.FiltersService.advancedSearchParse = function(input, pattern, ignoreRegex, notOperators, andOperators, orOperators){

        var operators
            ,tree;

        if(!notOperators || notOperators.length == 0){
            notOperators = ['-'];
        }

        if(!andOperators || andOperators.length == 0){
            andOperators = ['&&'];
        }

        if(!orOperators || orOperators.length == 0){
            orOperators = [','];
        }

        operators = orOperators.concat(andOperators).concat(notOperators);

        tree = scan(pattern, operators, 0, ignoreRegex);

        return parse(tree, input, notOperators, andOperators, orOperators);
    };
	
})();	