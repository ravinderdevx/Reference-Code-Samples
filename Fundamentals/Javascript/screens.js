
var AddActionForm;
$(function () {
    AddActionForm = $('#AddActionForm');
});

function BindGrid(FK_screenId) {
    $("#FK_screenId").val(FK_screenId);
    var n = FK_screenId;
    var path = $URL._showGridlIst;
    $.getJSON(path, { FK_screenId: n }, function (data) {
        if (data != null) {
            $('#ActionGrid').html("");
            var table = '<table id="Actiongrid" class="table table-hover table-striped">';
            table += '<tr>';
            table += '<th data-field="ActionId" class="visible">Action ID</th>';
            table += '<th data-field="ActionId">Action Name</th>';
            table += '<th data-field="ActionId"></th>';
            table += '</tr>';
            $.each(data, function (i, item) {
                table += '<tr>';
                table += '<td class="visible">' + item.ActionId;
                table += '</td>';
                table += '<td class="f2">' + item.ActionName
                table += '</td>';
                table += '<td><a id="edit"  class="edit ml10" href=javascript:EditScreenAction(' + item.ActionType + ',' + item.ActionId + ',"' + item.ActionName + '")';

                table += ' title="Edit"><i class="glyphicon glyphicon-edit"></i> </a>';
                table += '&nbsp;&nbsp';
                table += '<a id="delete" class="remove ml10" href=javascript:deleteScreenAction(' + item.ActionId + ')';
                table += ' title="Remove"><i class="glyphicon glyphicon-remove"></i> </a>';
                table += '</td>';

                table += '</tr>';
            })
            table += '</table>';
            $('#ActionGrid').append(table);

        }
        else {
            document.write("Not Found");
        }
    });
}

function EditScreenAction(ActionType, ActionId, ActionName) {
    $("#txtActionName").val(ActionName);
    $("#ActionType").val(ActionType);
    $("#ActionId").val(ActionId);
    $(".CreateSAction").css("display", "none");
    $(".EditSAction").css("display", "inline-block");

}

function AddActionsubmit(e) {
    // alert("add action");
    $(".EditSAction").css("display", "none");
    if ($('#ActionType option:selected').text() == "Select") {
        BootstrapDialog.alert("Please select ActionType");
        $("#ActionType").focus();
        return;
    }
    if ($("#txtActionName").val().trim() == "") {
        //alert("test1");
        BootstrapDialog.alert("Please Enter Action Name");
        $("#txtActionName").focus();
        return;
    }

    {
        $.ajax({
            cache: false,
            async: true,
            type: "POST",
            url: $URL._ScreenAction,
            data: AddActionForm.serialize(),
            success: function (data) {
                if (data.ResponseStatus) {
                    ShowMessage(BootstrapDialog.TYPE_SUCCESS, data.ResponseText);
                    BindGrid($("#FK_screenId").val());
                    $("#AddActionModel").modal('hide');

                }
                else {
                    ShowMessage(BootstrapDialog.TYPE_SUCCESS, data.ResponseText);
                }
                $("#ActionType").val("0");
                $('#txtActionName').val('');
            },
            error: function (request, error) {
                if (request.statusText == "CustomMessage") {
                    $("#spanError").html(request.responseText)
                }
            },
        });
    }
}
function EditAction(event) {
    // alert("edit");
    mycustomeEdit(event);
}
var formEditAction = $('#AddActionForm');
function mycustomeEdit(e) {
    e.preventDefault();
    $.ajax({
        cache: false,
        async: true,
        type: "POST",
        // url: "screen/EditScreenAction",
        url: $URL._EditScreenAction,
        data: formEditAction.serialize(),
        success: function (data) {

            $("#txtActionName").val("");
            $("#ActionType").val(0);
            $(".CreateSAction").css("display", "inline-block");
            $(".EditSAction").css("display", "none");
            BindGrid($("#FK_screenId").val());
            ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Your Record is successfully updated.');
        },
        error: function (request, error) {
            if (request.statusText == "CustomMessage") {
                $("#spanError").html(request.responseText)
            }
        },
    });


}

function deleteScreenAction(ActionId) {

    BootstrapDialog.show({
        title: 'Confirmation',
        message: 'Are you sure you want to delete this record?',
        buttons: [{
            label: 'Yes',
            cssClass: 'btn-primary',
            action: function (dialogItself) {
                var n = ActionId;


                $.ajax({
                    type: "POST",
                    url: "/screen/DeleteScreenAction",
                    data: '{id: "' + ActionId + '" }',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        $("#txtActionName").val("");
                        //   $("#ActionType").val(0);
                        $(".CreateSAction").css("display", "inline-block");
                        $(".EditSAction").css("display", "none");
                        BindGrid($("#FK_screenId").val());
                        dialogItself.close();
                    },
                    failure: function (response) {
                        alert(response.d);
                    }
                });
            }
        }, {
            label: 'No',
            cssClass: 'btn-danger',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }]
    });
}

function deleteData(ActionId) {


}
function OnSuccess(response) {

    BindGrid($("#FK_screenId").val());
    dialogItself.close();

}

function ClearVal() {

    $("#txtActionName").val(' ');
    $("#ActionType").val(0);
}

function mycustomsubmit(e) {
    e.preventDefault();
    if (form.valid()) {
        $.ajax({
            cache: false,
            async: true,
            type: "POST",
            url: $URL._CreateScreen,
            data: form.serialize(),
            success: function (data) {
                $("#spanError").html("");
                window.location = '@UserListingURL()'
            },
            error: function (request, error) {
                if (request.statusText == "CustomMessage") {
                    $("#ScreenName").val('');
                    $("#ModuleId").val('');
                    $("#spanError").html(request.responseText)
                }
            },
            headers: {
                'RequestVerificationToken': token
            }
        });
    }
}


function Addtitle() {
    $('.page-next').attr('Title', 'Next');
    $('.page-first').attr('Title', 'First');
    $('.page-last').attr('Title', 'Last');
    $('.page-pre').attr('Title', 'Previous');
}

// Edit and Delete Formatte links
function operateFormatter(value, row, index) {
 
    var rowid = row.screenId;
    return [
        '<a id="edit"  class="edit ml10" href="javascript:void(0)" title="Edit">',
            '<i class="glyphicon glyphicon-edit"></i>',
        '</a>&nbsp;&nbsp;',
        '<a id="delete" class="remove ml10" href="javascript:void(0)" title="Remove">',
            '<i class="glyphicon glyphicon-remove"></i>',
        '</a>&nbsp;&nbsp;',
        '<a id="AddAction" href="javascript:showScreenAction(' + rowid + ')" class="AddAction ml10"  title="Add Action">',

            '<img src="/1431806156_list-add-user.png" style="width: 20px; height: 20px;" />',
        '</a>'
    ].join('');
}

// Link Events Edit and Delete
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $.ajax({
            cache: false,
            async: true,
            type: "POST",
            url: "/Users/Users/IsUserPermitedtoDelete",
            success: function (data) {
                if (data == true) {

                    $("#myModal").modal('show');
                    $("#screenId").val(row.screenId);
                    $("#showscreenId").text(row.screenId);
                    $("#txtscreenName").val(row.ScreenName);
                    $("#ModuleId").val(row.ModuleId);
                }
                else {
                    ShowMessage(BootstrapDialog.TYPE_DANGER, 'Sorry, only Super Admin can edit this user!');
                    RefreshGrid();
                }
            },
            error: function (request) {
            },
        })
    },

    'click .AddAction': function (e, value, row, index) {
        $.ajax({
            cache: false,
            async: true,
            type: "POST",
            url: $URL._IsUserPermitedtoDelete,
            success: function (data) {
                if (data == true) {

                    $(".CreateSAction").css("display", "inline-block");
                    $(".EditSAction").css("display", "none");
                    //$("#txtActionName").val("");
                    $("#ActionType").val(0);
                    $("#FK_screenId").val(row.screenId);
                    $("#ActionHeading").text(row.ScreenName + "   " + "Action");

                    $("#AddActionModel").modal('show');
                    BindGrid(row.screenId);
                }
                else {
                    ShowMessage(BootstrapDialog.TYPE_DANGER, 'Sorry, only Super Admin can add action for this user!');
                    RefreshGrid();
                }
            },
            error: function (request) {
            },
        })

    },

    'click .remove': function (e, value, row, index) {
        $.ajax({
            cache: false,
            async: true,
            type: "POST",
            url: $URL._IsUserPermitedtoDelete,
            success: function (data) {
                if (data == true) {
                    BootstrapDialog.show({
                        title: 'Confirmation',
                        message: 'Are you sure you want to delete this record?',
                        buttons: [{
                            label: 'Yes',
                            cssClass: 'btn-primary',
                            action: function (dialogItself) {
                                $.ajax({
                                    cache: false,
                                    async: false,
                                    type: "POST",
                                    url: $("#HiddenHostName").val() + "/api/screenAPI/Deletescreen/" + row.screenId,
                                    success: function (data) {
                                        if (data == true) {
                                            RefreshGrid();
                                            dialogItself.close();
                                        }
                                        else {
                                            ShowMessage(BootstrapDialog.TYPE_DANGER, 'Error occured.');
                                        }
                                    },
                                    error: function (request, error) {
                                        if (request.statusText == "CustomMessage") {
                                            $("#spanError").html(request.responseText)
                                        }
                                    },
                                    headers: {
                                        'RequestVerificationToken': token
                                    }
                                });
                            }
                        }, {
                            label: 'No',
                            cssClass: 'btn-danger',
                            action: function (dialogItself) {
                                dialogItself.close();
                            }
                        }]
                    });
                }
                else {
                    ShowMessage(BootstrapDialog.TYPE_DANGER, 'Sorry, only Super Admin can delete this user!');
                    RefreshGrid();
                }
            },
            error: function (request) {
            },
        })
    }
};

function rowStyle(row, index) {
    var classes = ['active', 'success', 'info', 'warning', 'danger'];

    if (index % 2 === 0) {
        return {
            classes: classes[1]
        };
    }
    return {};
}

function showScreenAction(src) {
    //alert(src);
}

function RefreshGrid() {
    $('#grid').bootstrapTable('refresh', { silent: true });
}

function ShowMessage(type, message) {
    $messageData = $("<span>Information</span>");
    BootstrapDialog.show({
        title: $messageData,
        type: type,
        message: message,
        closable: true,
        closeByBackdrop: false,
        closeByKeyboard: false,
        buttons: [{
            label: 'Ok',
            action: function (dialogItself) {
                dialogItself.close();

            }
        }]
    });
}

function AddNew() {

    $("#AddModal").modal('show');
    $(form).focus_first();
    $("#ScreenName").val('');

}

function LoadSuccess() {

}
// Focus first element
$.fn.focus_first = function () {
    var elem = $('input:visible', this).get(0);
    var select = $('select:visible', this).get(0);
    if (select && elem) {
        if (select.offsetTop < elem.offsetTop) {
            elem = select;
        }
    }
    var textarea = $('textarea:visible', this).get(0);
    if (textarea && elem) {
        if (textarea.offsetTop < elem.offsetTop) {
            elem = textarea;
        }
    }

    if (elem) {
        elem.focus();
    }
    return this;
}