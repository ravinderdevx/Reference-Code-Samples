$(document).ready(function () {

    $("#EditForm").unbind().on("submit", function (event) {
        var types = BootstrapDialog.TYPE_DANGER;
        if ($("#txtFirstName").val() == "") {
            ShowMessage(BootstrapDialog.TYPE_DANGER, "Enter First Name");

            return false;
        }
        if ($("#txtLastName").val() == "") {
            ShowMessage(BootstrapDialog.TYPE_DANGER, "Enter Last Name");
            return false;
        }
        if ($("#txtEmail").val() == "") {
            ShowMessage(BootstrapDialog.TYPE_DANGER, "Enter Email Address.");
            return false;
        }

        if ($('.gridtable input[type="checkbox"]:checked').length == 0) {
            ShowMessage(BootstrapDialog.TYPE_DANGER, 'Please Select Any Role.');
            return false;
        }

        var sEmail = $('#txtEmail').val();
        // Checking Empty Fields

        if (validateEmail(sEmail)) {
            ShowMessage(BootstrapDialog.TYPE_DANGER, 'Invalid Email Address.');
            return false;
            
        }

        mycustomEditsubmit(event);

    });
});

function updateSuccess(data) {

    if (data == 'This email is already registered') {
        $('#divSpanError').show();
    }
    else {
        $('#divSpanError').attr('style', 'display:none;');

        //alert("User created successfully!");
        window.location.href = "";

        $('#loadingmessage').hide();
    }
}


function hideCustomErr() {

    $('#loadingmessage').show();
    $('#divSpanError').attr('style', 'display:none;');
    return true;
}
function checkRole() {
    if ($('.gridtable input[type="checkbox"]:checked').length == 0) {
        ShowMessage(BootstrapDialog.TYPE_DANGER, 'Please Select Any Role.');
        return false;
    }

}

function mycustomsubmitsave(e) {
    if ($(".adduser #FirstName").val() == "") {
        $(".adduser #FirstName").focus();
        return false;
    }
    if ($(".adduser #LastName").val() == "") {
        $(".adduser #LastName").focus();
        return false;
    }
    if ($(".adduser #Email").val() == "") {
        $(".adduser #Email").focus();
        return false;
    }
    if ($(".adduser #Password").val() == "") {
        $(".adduser #Password").focus();
        return false;
    }
    if ($(".adduser #Password").val() == "") {
        return;
    }

}

function Selectcheckbox(Ctr) {

    // alert("check");
    if ($(Ctr).is(":checked")) {
        //  alert("check");
        str = (Ctr.value.toString());
        if ($("#RoleIDs").val() == "") {
            $("#RoleIDs").val(str + ",");
        }
        else {
            str = $("#RoleIDs").val() + str + ",";
            $("#RoleIDs").val(str);
        }
    }
    else {
        str = (Ctr.value.toString());
        $("#RoleIDs").val($("#RoleIDs").val().replace(str + ",", ""));
        if ($("#HiddenDeleteIds").val() == "") {
            $("#HiddenDeleteIds").val(str + ",");
        }
        else {
            str = $("#HiddenDeleteIds").val() + str + ",";
            $("#HiddenDeleteIds").val(str);

        }
        //alert($("#HiddenDeleteIds").val());
        //alert($("#RoleIDs").val());
    }

    $(".form-group #RoleIDs").val($("#RoleIDs").val())
}

function mycustomsubmit(e) {
    if ($("#Password").val() == "") {
        return;
    }
    e.preventDefault();
    if (form.valid()) {
        $('#loadingmessage').show();
        $.ajax({
            cache: false,
            async: true,
            type: "POST",
            url: $URL._Users,
            data: form.serialize(),
            success: function (data) {
                $("#spanError").html("");
                $("#RoleIDs").val("");
                $('#loadingmessage').hide();
                window.location = $URL._UsersIndex;
            },
            error: function (request, error) {
                if (request.statusText == "CustomMessage") {
                    $("#spanError").html(request.responseText)
                }
            },
            headers: {
                'RequestVerificationToken': '@TokenHeaderValue()'
            }
        });
    }


    function Selectcheckbox(Ctr) {


        if ($(Ctr).is(":checked")) {
            //  alert("check");
            str = (Ctr.value.toString());
            if ($("#RoleIDs").val() == "") {
                $("#RoleIDs").val(str + ",");
            }
            else {
                str = $("#RoleIDs").val() + str + ",";
                $("#RoleIDs").val(str);
            }
        }
        else {
            str = (Ctr.value.toString());
            $("#RoleIDs").val($("#RoleIDs").val().replace(str + ",", ""));
            //alert($("#RoleIDs").val());
        }

        //alert($("#HiddenRoleIDs").val());
    }
}

function Addtitle() {
    $('.page-next').attr('Title', 'Next');
    $('.page-first').attr('Title', 'First');
    $('.page-last').attr('Title', 'Last');
    $('.page-pre').attr('Title', 'Previous');
}
// Edit and Delete Formattte links
function operateFormatter(value, row, index) {
    return [
        '<a id="edit"  class="edit ml10" href="javascript:void(0)" title="Edit">',
            '<i class="glyphicon glyphicon-edit"></i>',
        '</a>&nbsp;&nbsp;',
        '<a id="delete" class="remove ml10" href="javascript:void(0)" title="Remove">',
            '<i class="glyphicon glyphicon-remove"></i>',
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
            url: $URL._IsUserPermitedtoDelete,
            success: function (data) {
                if (data == true) {
                    //ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Record deleted successfully.');
                    $("#myModal").modal('show');
                    $("#userId").val(row.UserId);
                    $("#txtFirstName").val(row.FirstName);
                    $("#txtLastName").val(row.LastName);
                    $("#txtEmail").val(row.Email);
                    $("#HiddenUserId").val(row.UserId);
                    $("#Password").val("abcdefg");
                    $("#ConfirmPassword").val("abcdefg");
                    FillCheckBox(row.UserId);
                }
                else {
                    ShowMessage(BootstrapDialog.TYPE_DANGER, 'Sorry, only Super Admin can edit this user!');
                    RefreshGrid();
                }
            },
            error: function (request) {
            },
        })
    }
        ,
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
                                    url: $("#HiddenHostName").val() + "/api/UsersAPI/DeleteUser/" + row.UserId,
                                    success: function (data) {
                                        if (data == true) {
                                            ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Records have been deleted successfully.');
                                            RefreshGrid();
                                            dialogItself.close();
                                            window.location.href = "";
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

function RefreshGrid() {
    $('#grid').bootstrapTable('refresh', { silent: true });
    Addtitle();
}

//BootstrapDialog.TYPE_DEFAULT,
//BootstrapDialog.TYPE_INFO,
//BootstrapDialog.TYPE_PRIMARY,
//BootstrapDialog.TYPE_SUCCESS,
//BootstrapDialog.TYPE_WARNING,
//BootstrapDialog.TYPE_DANGER
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

function FillCheckBox(UserId) {
    //alert(UserId);
    //  $("#FK_screenId").val(FK_screenId);
    var n = UserId; //$("#FK_screenId").val();
    // alert(n);
    // $("#cbSelectAll").removeAttr("checked");
    $('[name=ids]').prop("checked", false);
    $("#cbSelectAll").prop("checked", false);
    var path = $URL._GetUserRolesById;
    $.getJSON(path, { UserId: n }, function (data) {
        var ids = "";
        if (data != null) {
            $.each(data, function (i, item) {
                var id = item.RoleId;
                ids = ids + id + ","
                $("#" + id).prop("checked", true);
            })
            $("#RoleIDs").val(ids);
            var totalRows = $("#checkableGrid td :checkbox").length;
            var checked = $("#checkableGrid td :checkbox:checked").length;

            if (totalRows == checked) {
                $("#cbSelectAll").prop("checked", true);
            }
            else {
                $("#cbSelectAll").prop("checked", false);
            }
        }
        else {
            // document.write("Not Found");
            $("#cbSelectAll").prop("checked", false);
        }
    });
}

function DeleteUserRoles(UserId, str) {
    // alert(str);
    $('#loadingmessage').show();

    $.ajax({
        type: "POST",
        url: $URL._DeleteUserRolesById,
        data: '{Ids: "' + str + '",UserId: ' + UserId + ' }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //  dialogItself.close();
            $("#HiddenDeletepermission").val("");

            $('#loadingmessage').hide();
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function CreateUserRoles(UserId, str) {
    // alert(str);
    $('#loadingmessage').show();

    $.ajax({
        type: "POST",
        url: $URL._CreateUserRoles,
        data: '{Ids: "' + str + '",UserId: ' + UserId + ' }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //  dialogItself.close();
            $("#HiddenDeletepermission").val("");

            $('#loadingmessage').hide();
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function AddNew() {
    //  window.location.href = "/Patients/Patients/Create";
    //  $("hdtext").text("Add Role");
    //   window.location.href = "/Users/Users/Create";
    saveid = 1;
    $("#AddModal").modal('show');
    $('form').focus_first();
}

function MassUpdate() {
    $.ajax({
        cache: false,
        async: true,
        type: "POST",
        url: $URL._IsUserPermitedtoDelete,
        success: function (data) {
            if (data == true) {
                CheckUncheckAll();
            }
            else {
                ShowMessage(BootstrapDialog.TYPE_DANGER, 'Sorry, you are not authorized user!');
                RefreshGrid();
            }
        },
        error: function (request) {
        },
    })
}
function CheckUncheckAll() {

    if ($("#hiddenMassUpdatecheckAllsts").val() == "" && $("#hiddenMassUpdatecheckAll").val() == "") {
        BootstrapDialog.alert("Please select Users");
        return false;
    }


    var roleNames = $("#hiddenMassUpdatecheckAll").val();
    var unCheckIds = '';
    if ($("#hiddenMassUpdatecheckAllsts").val() == "allcheck" && $("#hiddenMassUpdatecheckAll").val() == "0" && $("#hiddenMassUpdatecheckAll").val() != "") {
        unCheckIds = $("#hiddenMassUncheckIds").val();
    } else { unCheckIds = '0'; }

    var activtype = $("#ddlactivate").val();
    //   alert(roleNames);
    // var ModuleID = $("#ModuleList :selected").val();
    //  var str = $("#HiddenAllpermission").val();
    //alert(str);
    //$('#loadingmessage').show();
    var flag = 0;
    var msg = '';
    if (activtype == "1") {
        flag = 2;
        msg = 'Are you sure you want to activate these records?';
    }
    else if (activtype == "2") {
        flag = 7;
        msg = 'Are you sure you want to delete these records?';
    }
    else {
        flag = 3;
        msg = 'Are you sure you want to deactivarte these records?';
    }

    if ($("#hiddenMassUpdatecheckAllsts").val() == "allcheck") {
        roleNames = "0";
        if (unCheckIds == "0" || unCheckIds == "") {
            if (activtype == "1") { flag = 4; msg = 'Are you sure you want to activate these records?'; }
            else if (activtype == "2") { flag = 6; msg = 'Are you sure you want to delete these records?'; }
            else { flag = 5; msg = 'Are you sure you want to deactivarte these records?'; }
        }
    }

    BootstrapDialog.show({
        title: 'Confirmation',
        message: msg,
        buttons: [{
            label: 'Yes',
            cssClass: 'btn-primary',
            action: function (dialogItself) {
                $('#loadingmessage').show();
                $.ajax({
                    type: "POST",
                    url: $URL._MassUpdateUser,
                    data: '{UserNames: "' + roleNames + '",UnCheckIds:"' + unCheckIds + '",ModifyBy: ' + flag + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (activtype == "1") {
                            ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Records have been marked activated');
                            RefreshGrid();
                        }
                        else if (activtype == "2") {
                            ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Records have been deleted successfully.');
                            RefreshGrid();
                        }
                        else {
                            ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Records have been marked deactivated');
                            //   location.reload();
                            RefreshGrid();
                        }
                        $("#hiddenMassUpdatecheckAllsts").val("");
                        $("#hiddenMassUpdatecheckAll").val("");
                        $("#hiddenMassUncheckIds").val("");
                        $('#loadingmessage').hide();
                        window.location.href = "";
                    },
                    failure: function (response) {
                        alert(response.d);
                    }
                });
                dialogItself.close();
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

function CheckUncheckAllFill(src) {
    // alert(src);
    if (src == "allcheck") {
        $("#hiddenMassUpdatecheckAllsts").val("allcheck");
        $("#hiddenMassUpdatecheckAll").val("0");
    }
    else {
        $("#hiddenMassUpdatecheckAllsts").val("");
        $("#hiddenMassUpdatecheckAll").val("");
    }
}


function checkRow(src) {

    var str = src.UserId.toString();
    if ($("#hiddenMassUncheckIds").val() != "") { $("#hiddenMassUncheckIds").val($("#hiddenMassUncheckIds").val().replace(str.toString() + ",", " ")); }

    if ($("#hiddenMassUpdatecheckAll").val() == "") {
        $("#hiddenMassUpdatecheckAll").val(str + ",");
        // $("#hiddenMassUpdateUncheck").val($("#hiddenMassUpdateUncheck").val().replace(str.toString() + ",", " "));
    }
    else {
        str = $("#hiddenMassUpdatecheckAll").val() + "" + str + ","
        $("#hiddenMassUpdatecheckAll").val(str);
        //  $("#hiddenMassUpdateUncheck").val($("#hiddenMassUpdateUncheck").val().replace(str.toString() + ",", " "));
    }

}
function UncheckRow(src) {

    var str = src.UserId.toString();

    if ($("#hiddenMassUncheckIds").val() == "") { $("#hiddenMassUncheckIds").val(str + ","); }
    else {
        str = $("#hiddenMassUncheckIds").val() + "" + str + ","
        $("#hiddenMassUncheckIds").val(str);
    }

    if ($("#hiddenMassUpdatecheckAll").val() != "") {
        // $("#hiddenMassUpdatecheckAll").val(str + ",");
        $("#hiddenMassUpdatecheckAll").val($("#hiddenMassUpdatecheckAll").val().replace(str.toString() + ",", " "));
    }
}
function LoadSuccess() {
    $("#btnMassUpdate").show();
    $("#ddlactivate").show();
    $('#loadingmessage').hide();
}
function Selectcheckbox(Ctr) {


    if ($(Ctr).is(":checked")) {
        //  alert("check");
        str = (Ctr.value.toString());
        //  alert(str);
        if ($("#RoleIDs").val() == "") {
            $("#RoleIDs").val(str + ",");
        }
        else {
            str = $("#RoleIDs").val() + str + ",";
            $("#RoleIDs").val(str);
        }
    }
    else {
        str = (Ctr.value.toString());
        $("#RoleIDs").val($("#RoleIDs").val().replace(str + ",", ""));
        //alert($("#RoleIDs").val());
    }

    // alert($("#RoleIDs").val());
}
function validateEmail(sEmail) {
    //var filter = /^[\w\-\.\+]+\@@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    //if (filter.test(sEmail)) {
    //    return true;
    //}
    //else {
    //    return false;
    //}
    var reg = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if (!reg.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
}

function CloseAddUserPopup() {
    window.location.href = "";
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
function ShowEditPopup(UserId) {
  
    $.ajax({
        type: "POST",
        url: $URL._UserEditPopup,
        data: '{UserId: ' + UserId + ' }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $.each(data, function (i, item) {
                $("#myModal").modal('show');

                $("#userId").val(item.UserId);
                $("#txtFirstName").val(item.FirstName);
                $("#txtLastName").val(item.LastName);
                $("#txtEmail").val(item.Email);
                $("#HiddenUserId").val(item.UserId);
                $("#RoleIDs").val(item.RoleId);

                $("#Password").val("abcdefg");
                $("#ConfirmPassword").val("abcdefg");
                FillCheckBox(item.UserId);
            })
        },
        failure: function (response) {
            alert(response.d);
        }
    });

}



$("#btnFilter").unbind().click(function () {
    var firstname = $("#FirstName").val();
    var lastname = $("#LastName").val();
    var email = $("#Email").val();

    Param.clickBtn = true;
    form = $('#EditForm');
    if (firstname != "") {
        Param.FirstName = firstname;
    }
    else {
        Param.FirstName = "";
    }
    if (lastname != "") {
        Param.LastName = lastname;
    }
    else {
        Param.LastName = "";
    }
    if (email != "") {
        Param.Email = email;
    }
    else {
        Param.Email = "";
    }
    $('#grid').bootstrapTable('filterBy');
    Param.clickBtn = false;
});

function mycustomEditsubmit(e) {
    $('#loadingmessage').show();
    e.preventDefault();
    $.ajax({
        cache: false,
        async: true,
        type: "POST",
        url: $("#HiddenHostName").val() + "/api/UsersAPI/EditUser",
        data: form.serialize(),
        success: function (data) {
            RefreshGrid();
            $('#loadingmessage').hide();
            ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Record is updated successfully.');
            $("#HiddenUserId").val("");
            $("#HiddenDeleteIds").val("");
            $("#RoleIDs").val("");
            $("#myModal").modal('hide');
            window.location.href = "";

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