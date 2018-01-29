$(document).ready(function(){
    $('select').select2({
        minimumResultsForSearch: -1,
        width: 'auto'
    });

    $.getJSON('json/available.json', function(data) {
        $('#availableItems').treeview({data: data});
        $('#selectedItems').treeview({data: data});
    });

    $(".collapseAll").click(function () {
        $('#availableItems').treeview('collapseAll', { silent: true });
    });
    $(".expandAll").click(function () {
        $('#availableItems').treeview('expandAll', { silent: true });
    });
    $(".selCollapseAll").click(function () {
        $('#selectedItems').treeview('collapseAll', { silent: true });
    });
    $(".selExpandAll").click(function () {
        $('#selectedItems').treeview('expandAll', { silent: true });
    });

    $('.input-group.date').datepicker({
        clearBtn: true,
        daysOfWeekHighlighted: "0,6",
        autoclose: true,
        todayHighlight: true,
        toggleActive: true
    });
    $('.enlargeImgBtn').on('click', function() {
        $('.enlargeImg').trigger('click');
    });
});

jQuery(window).load(function () {
    $(".scroller").mCustomScrollbar({
        theme: "minimal-dark",
        scrollbarPosition: "inside",
        scrollButtons:{ enable: true },
        callbacks:{
            onScrollStart:function(){
                $("select").select2().trigger("select2:close");
            }
        }
    });
});