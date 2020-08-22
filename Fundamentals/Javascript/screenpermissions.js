var showpopup = "0";
var callbacks = $.Callbacks();
$(document).ready(function () {
    $("#HiddenAllpermission").val("");
    $("#HiddenExitspermission").val("");
    $("#HiddenDeletepermission").val("");
    $("#HiddenDeletepermission").val("");
    $("#RoleList").change(function () {
        if (($("#ModuleList :selected").text() == "Select Module")) {
            $("#ModuleList").focus();
            return;
        }
        if (($("#RoleList :selected").text() == "Select Role")) {
            $("#RoleList").focus();
            return;
        }
        CheckBoxFill();
    });
    $("#ModuleList").change(function () {
        if (($("#ModuleList :selected").text() == "Select Module")) {
            $("#ModuleList").focus();
            return;
        }
        if (($("#RoleList :selected").text() == "Select Role")) {
            $("#RoleList").focus();
            return;
        }
        CheckBoxFill();
    });

    BindGrid();

    $("#ButtonAdd").click(function () {
        $.ajax({
            cache: false,
            async: true,
            type: "POST",
            url: "/Users/Users/IsUserPermitedtoDelete",
            success: function (data) {
                if (data == true) {
                    if (($("#RoleList :selected").text() == "Select Role")) {
                        $("#RoleList").focus();
                        alert("Please select role");
                        return;
                    }
                    if (($("#ModuleList :selected").text() == "Select Module")) {
                        $("#ModuleList").focus();
                        alert("Please select module");
                        return;
                    }
                    if ($("#HiddenDeletepermission").val() != "") {
                        DeletePermission();

                    }

                    if (($("#HiddenDeletepermission").val() == "") && ($("#HiddenAllpermission").val() == "") && ($("#HiddenExitspermission").val() == "")) {

                        alert("Please Select at least one Permission.");
                        return false;

                    }
                    if ($("#HiddenDeletepermission").val() == "" && $("#HiddenAllpermission").val() != "") {
                        AddScreenPermission();
                    }

                    alert('Screen permission saved successfully!');
                }
                else {
                    //ShowMessage(BootstrapDialog.TYPE_INFO, 'Sorry, only Admin and Super Admin can delete this user!');
                    alert("Sorry, you are not authorized user!");
                    return false;
                }
            },
            error: function (request) {
            },
        })

    });
});

function BindGrid() {

    var path = "/ScreenPermissions/ScreenPermissions/GetAllScreenPermissionl";
    $.getJSON(path, null, function (data) {
        if (data != null) {

            var j = "";
            $('#ActionGrid').html("");
            var table = '<table id="Actiongrid" class="gridtable">';
            table += '<tr>';

            table += '<th data-field="ActionId">Screen Name</th>';
            table += '<th data-field="Actions">Actions</th>';
            table += '</tr>';

            $.each(data, function (i, item) {
                // alert(item.ScreenName);
                if (i == 0) {
                    table += '<tr style="border-style: solid; border-width: 1px;">';
                    j = item.ScreenName;
                    table += '<td class="visible"><input id="' + "hfv" + item.ScreenId + '" type="hidden" value="' + item.ScreenId + '" />' + item.ScreenName;
                    table += '</td>';
                    if (item.ActionId == 0) {
                        if (item.ActionName == "Custom") {

                        }
                        else {
                            table += '<td class="f2"><input id="' + item.ScreenId + "," + item.ActionId + "," + item.ActionName + '" class="' + item.ActionName + "" + item.ScreenId + "" + item.ActionId + '" type="checkbox" onclick="javascript:Selectcheckbox(this);" disabled="disabled" />' + item.ActionName
                        }
                    }
                    else {
                        table += '<td class="f2"><input id="' + item.ScreenId + "," + item.ActionId + "," + item.ActionName + '" class="' + item.ActionName + "" + item.ScreenId + "" + item.ActionId + '" type="checkbox" onclick="javascript:Selectcheckbox(this);"/>' + item.ActionName
                    }
                    table += '</td>';
                }
                else if (j.toString().toLocaleLowerCase() == item.ScreenName.toString().toLocaleLowerCase()) {
                    // alert(j);
                    if (item.ActionId == 0) {
                        if (item.ActionName == "Custom") {

                        }
                        else {
                            table += '<td class="f2"><input id="' + item.ScreenId + "," + item.ActionId + "," + item.ActionName + '" class="' + item.ActionName + "" + item.ScreenId + "" + item.ActionId + '" type="checkbox" onclick="javascript:Selectcheckbox(this);" disabled="disabled" />' + item.ActionName
                        }
                    }
                    else {
                        table += '<td class="f2"><input id="' + item.ScreenId + "," + item.ActionId + "," + item.ActionName + '" class="' + item.ActionName + "" + item.ScreenId + "" + item.ActionId + '" type="checkbox" onclick="javascript:Selectcheckbox(this);"/>' + item.ActionName
                    }
                    //  table += '<td class="f2"><input id="' + item.ScreenId + "," + item.ActionId + "," + item.ActionName + '" class="' + item.ActionName + "" + item.ScreenId + "" + item.ActionId + '" type="checkbox" onclick="javascript:Selectcheckbox(this);" />' + item.ActionName
                    table += '</td>';
                }

                else {
                    table += '</tr>';
                    j = item.ScreenName;
                    table += '<tr style="border-style: solid; border-width: 1px;">';
                    table += '<td class="visible"><input id="' + "hfv" + item.ScreenId + '" type="hidden" value="' + item.ScreenId + '" />' + item.ScreenName;
                    table += '</td>';
                    if (item.ActionId == 0) {
                        if (item.ActionName == "Custom") {

                        }
                        else {
                            table += '<td class="f2"><input id="' + item.ScreenId + "," + item.ActionId + "," + item.ActionName + '" class="' + item.ActionName + "" + item.ScreenId + "" + item.ActionId + '" type="checkbox" onclick="javascript:Selectcheckbox(this);" disabled="disabled" />' + item.ActionName
                        }
                    }
                    else {
                        table += '<td class="f2"><input id="' + item.ScreenId + "," + item.ActionId + "," + item.ActionName + '" class="' + item.ActionName + "" + item.ScreenId + "" + item.ActionId + '" type="checkbox" onclick="javascript:Selectcheckbox(this);"/>' + item.ActionName
                    }
                    // table += '<td class="f2"><input id="' + item.ScreenId + "," + item.ActionId + "," + item.ActionName + '" class="' + item.ActionName + "" + item.ScreenId + "" + item.ActionId + '" type="checkbox" onclick="javascript:Selectcheckbox(this);" />' + item.ActionName
                    table += '</td>';

                }


            })
            table += '</tr>';

            table += '</table>';
            $('#ActionGrid').append(table);

        }
        else {
            document.write("Not Found");
        }
    });



}
//   setTimeout(BindGrid, 1000);
function Selectcheckbox(Ctr) {
    showpopup = "0";
    var str = Ctr.id.toString();
    if ($(Ctr).is(':checked')) {
        if ($("#HiddenAllpermission").val() == "") {
            $("#HiddenAllpermission").val(str + "/");
        }
        else {
            str = $("#HiddenAllpermission").val() + "" + str + "/"
            $("#HiddenAllpermission").val(str);
        }

    }
    else {
        $("#HiddenAllpermission").val($("#HiddenAllpermission").val().replace(str + "/", ""));
        if ($("#HiddenDeletepermission").val() == "") {
            $("#HiddenDeletepermission").val(str + "/");
        }
        else {
            str = $("#HiddenDeletepermission").val() + "" + str + "/"
            $("#HiddenDeletepermission").val(str);
        }
    }

}

function AddScreenPermission() {
    var RoleId = $("#RoleList :selected").val();
    var ModuleID = $("#ModuleList :selected").val();
    var str = $("#HiddenAllpermission").val();
    $('#loadingmessage').show();
    $.ajax({
        type: "POST",
        url: "/ScreenPermissions/ScreenPermissions/AddScreenPermission",
        data: '{str: "' + str + '",RoleId: ' + RoleId + ',ModuleID: ' + ModuleID + ' }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $('#loadingmessage').hide();
            if (showpopup.toString() == "0") {
                $('#RoleList').val('');
                $('#ModuleList').val('');
                $('input[type="checkbox"]').attr('checked', false);
                ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Your Permission is successfully Added.');

                showpopup = "1";
            }


            $("#HiddenAllpermission").val("");
        },
        failure: function (response) {
            alert(response.d);
        }
    });

}

function DeleteScreenPermission(str) {
    // alert(str);
    $('#loadingmessage').show();
    var RoleId = $("#RoleList :selected").val();
    var ModuleID = $("#ModuleList :selected").val();
    $.ajax({
        type: "POST",
        url: "/ScreenPermissions/ScreenPermissions/DeleteScreenPermission",
        data: '{str: "' + str + '",RoleId: ' + RoleId + ',ModuleID: ' + ModuleID + ' }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //  dialogItself.close();
            $("#HiddenDeletepermission").val("");

            if (showpopup == "0") {
                ShowMessage(BootstrapDialog.TYPE_SUCCESS, 'Your Permission is successfully Added.');
                showpopup = "1";
            }

            // BindGrid();
            $('#loadingmessage').hide();
        },
        failure: function (response) {
            alert(response.d);
        }
    });
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

function CheckBoxFill() {
    // BindGrid();
    $('#loadingmessage').show();
    $('input[type=checkbox]').attr('checked', false);
    var exitsIDs = "";
    var RoleId = $("#RoleList :selected").val();
    var ModuleID = $("#ModuleList :selected").val();
    $.ajax({
        type: "Post",
        url: "/ScreenPermissions/ScreenPermissions/GetPermissionList",
        data: '{RoleId: ' + parseInt(RoleId) + ',ModuleID: ' + parseInt(ModuleID) + ' }',
        //   data: null,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            // $('#loadingmessage').show();
            if (data.length > 0) {

                $.each(data, function (i, item) {
                    var ctr = item.ActionName + "" + item.ScreenId + "" + item.ActionId;

                    var id = "." + ctr.toString().trim();
                    // $("#HiddenExitspermission")
                    if ($("#HiddenExitspermission").val() == "") {
                        $("#HiddenExitspermission").val(exitsIDs + "/");
                    }
                    else {
                        str = $("#HiddenExitspermission").val() + "" + exitsIDs + "/"
                        $("#HiddenExitspermission").val(str);
                    }

                    $(id).prop("checked", true)

                });
                // $('#loadingmessage').hide();
                $('#loadingmessage').hide();
            }
            else {
                $('#loadingmessage').hide();
                BindGrid();
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });

}

function DeletePermission() {
    DeleteScreenPermission($("#HiddenDeletepermission").val());
    $("#HiddenDeletepermission").val("");
}