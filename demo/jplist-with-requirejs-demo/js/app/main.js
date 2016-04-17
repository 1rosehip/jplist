define(['jquery', 'jplist', 'jplist-sort-bundle', 'jplist-textbox-filter', 'jplist-pagination-bundle'], function($) {
    
    $(function() {
        
        //start jPList
        $('#demo').jplist({				
            itemsBox: '.list' 
            ,itemPath: '.list-item' 
            ,panelPath: '.jplist-panel'	
        });
    });
});