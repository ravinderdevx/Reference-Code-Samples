<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/survey/Survey.Master" CodeBehind="questions.aspx.vb" Inherits="App.Website.questions" %>

<%@ Register Assembly="DevExpress.Web.ASPxRichEdit.v15.1, Version=15.1.6.0, Culture=neutral" Namespace="DevExpress.Web.ASPxRichEdit" TagPrefix="dx" %>

<%@ Register Assembly="DevExpress.Web.v15.1, Version=15.1.6.0, Culture=neutral"
    Namespace="DevExpress.Web" TagPrefix="dx" %>
<%@ Register Src="~/Widgets/wid_datetime.ascx" TagName="DateTime" TagPrefix="widget" %>
<%@ Register Src="~/Widgets/CallsForToday.ascx" TagName="CallsForToday" TagPrefix="widget" %>

<%@ Register Assembly="DevExpress.Dashboard.v15.1.Web, Version=15.1.6.0, Culture=neutral" Namespace="DevExpress.DashboardWeb" TagPrefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript" src="../js/General/jquery-2.0.3.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.3/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.3/css/bootstrap.min.css" />
    <style type="text/css">
        .text-center {
            text-align: center;
        }

        .mb-10 {
            margin-bottom: 10px;
        }
        #mainContainer {
    padding: 15px 20px;
}

.question_block {
    margin: 20px 0;
    font-size: 14px;
    background: #eaf2fb;
    padding: 20px;
    box-sizing: border-box;
}

.question_block .large {
    font-weight: bold;
    margin-bottom: 20px;
}
    </style>
   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="SideHolder" runat="server">
    <table>
        <tr>
            <td>
                <dx:ASPxDockPanel runat="server" ID="ASPxDockPanel1" PanelUID="DateTime" HeaderText="Date & Time"
                    Height="95px" ClientInstanceName="dateTimePanel" Width="230px" OwnerZoneUID="zone1">
                    <ContentCollection>
                        <dx:PopupControlContentControl ID="PopupControlContentControl1" runat="server" SupportsDisabledAttribute="True">
                            <widget:DateTime ID="xDTWid" runat="server" />
                        </dx:PopupControlContentControl>
                    </ContentCollection>
                </dx:ASPxDockPanel>
                <%-- <dx:ASPxNavBar ID="ASPxNavBar2" runat="server" RenderMode="Lightweight">
                    <Groups>
                        <dx:NavBarGroup Name="GetNewDebtor" Text="Get New Debtor">
                            <Items>
                                <%-- <dx:NavBarItem Name="30days" Text="30 Days">
                                </dx:NavBarItem>
                                <dx:NavBarItem Name="GetNewDebtor" Text="Get Debtor">
                                </dx:NavBarItem>

                            </Items>
                        </dx:NavBarGroup>
                    </Groups>
                </dx:ASPxNavBar>--%>
            </td>

        </tr>
    </table>
    <dx:ASPxDockZone ID="ASPxDockZone1" runat="server" Width="229px" ZoneUID="zone1"
        PanelSpacing="3px" ClientInstanceName="splitter" Height="400px">
    </dx:ASPxDockZone>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainHolder" runat="server">
    <dx:ASPxCallbackPanel ID="ASPxCallbackPanel1" runat="server" Width="100%" ClientInstanceName="cab"
        OnCallback="ASPxCallback1_Callback" ShowLoadingPanel="False">
        <SettingsLoadingPanel Enabled="False"></SettingsLoadingPanel>

        <PanelCollection>
            <dx:PanelContent ID="PanelContent3" runat="server">
                <dx:ASPxLoadingPanel ID="ASPxLoadingPanel1" runat="server" Modal="true" ContainerElementID=""
                    ClientInstanceName="lp">
                </dx:ASPxLoadingPanel>

                <div class="row" id="mainContainer">
                    <div class="col-lg-12 col-sm-12 col-xs-12">
                        <div class="text-right">
                            <a class="btn btn-primary" onclick="OpenAddQuestionPopup()">Add Question</a>
                        </div>
                        <div id="QuestionList">
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="QuestionModal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="ModalTitle" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 class="modal-title" id="ModalTitle"></h4>
                            </div>
                            <div class="modal-body">
                       

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" onclick="SaveQuestionDetail()">Save Question</button>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </dx:PanelContent>
        </PanelCollection>
    </dx:ASPxCallbackPanel>
    <script type="text/javascript">

        function GetSurveyQuestionList() {
            $.ajax({
                url: 'questions.aspx/GetAllQuestionsBySurveyId',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (data) {
                    var QuestionList = data.d.QuestionsList;
                    var QuestionOptionList = [];
                    var QuestionListHtml = "";

                    if (QuestionList && QuestionList.length > 0) {
                        for (var i = 0; i < QuestionList.length; i++) {
                            QuestionListHtml += '<div class="question_block padding light-grey" id="question_' + QuestionList[i].question_id + '">\
                                                <p class="large" > ' + QuestionList[i].question_text + '</p>';

                            QuestionOptionList = QuestionList[i].Options;

                            if (QuestionOptionList && QuestionOptionList.length > 0) {
                                QuestionListHtml += '<div class="options_block">';
                                for (j = 0; j < QuestionOptionList.length; j++) {
                                    QuestionListHtml += ' <div class="radio">\
                                                   <label>\
                                                    <input type="radio" name="q_option_' + QuestionList[i].question_id + '" disabled="disabled" ' + (QuestionOptionList[j].is_correct ? 'checked' : '') + ' > ' + QuestionOptionList[j].option_text + '\
                                                   </label>\
                                                  </div>';
                                }
                                QuestionListHtml += '</div>';
                            }

                            QuestionListHtml += '<div class="action_buttons_block">\
                                              <a class="btn btn-primary" data-question="' + QuestionList[i].question_id + '" onclick="EditQuestion(this)">Edit Question</a>\
                                              <a class="btn btn-danger" data-question="' + QuestionList[i].question_id + '" onclick="DeleteQuestion(this)">Delete Question</a>\
                                             </div>\
                                            </div>';

                        }
                    }

                    $("#QuestionList").html(QuestionListHtml);
                },
                error: function (data) {
                    alert(data.d.Message);
                }
            });
            return false;
        }

        GetSurveyQuestionList();

        function DeleteQuestion(element) {
            var confirmation = confirm("Are you sure you want to delete it?");
            if (confirmation) {
                var question_id = $(element).attr('data-question');

                $.ajax({
                    url: 'questions.aspx/DeleteQuestion',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: '{question_id:"' + question_id + '"}',
                    success: function (data) {
                        $("#messages").html(data.d.Message);
                        
                    },
                    error: function (data) {
                        alert(data.d.Message);
                    }
                });
                GetSurveyQuestionList();
            }
        }

        function EditQuestion(element) {
            var question_id = $(element).attr('data-question');

            $.ajax({
                url: 'questions.aspx/EditQuestion',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: '{question_id:"' + question_id + '"}',
                success: function (data) {
                    debugger;
                    var QuestionDetail = data.d.SurveyQuestions;
                    var popup_html = '';
                    if (QuestionDetail) {
                        var popup_html = ' <div class="form-group">\
                           <label for="txtAddQuestion">Question </label>\
                           <input type="text" id="txtQuestion" class="form-control" placeholder="Question" value="' + QuestionDetail.question_text + '" />\
                          </div>\
                          <div class="form-group">\
                           <label for="txtAddQuestion">Answer Options </label>\
                          </div>\
                                            <div class="answer-options-container">';

                        var QuestionOptionList = QuestionDetail.Options;

                        if (QuestionOptionList && QuestionOptionList.length > 0) {
                            popup_html += '<table class="table answer-options">';
                            for (var i = 0; i < QuestionOptionList.length; i++) {
                                popup_html += '<tr>\
                                                 <td align="left">\
                                                  <input type="radio" name="answer" data-option="' + QuestionOptionList[i].option_id + '" value="' + QuestionOptionList[i].option_text + '" ' + (QuestionOptionList[i].is_correct ? 'checked' : '') + ' />\
                                                 </td>\
                                                 <td>\
                                                  <input type="text" name="options[]" class="form-control" data-option="' + QuestionOptionList[i].option_id + '"  value="' + QuestionOptionList[i].option_text + '" onblur="AddValueToAnwerRadio(this)" />\
                                                 </td>';

                                if (i > 1) {
                                    popup_html += '<td align="right">\
                                               <i class="glyphicon glyphicon glyphicon-trash"  data-question="' + QuestionDetail.question_id + '" data-option="' + QuestionOptionList[i].option_id + '" onclick="RemoveAnswerOption(this)"></i>\
                                              </td>';
                                } else {
                                    popup_html += '<td align="right"></td>';
                                }
                                popup_html += '</tr>'
                            }
                            popup_html += '</table>';
                        }

                        popup_html += ' <div class="text-center">\
                                            <button type="button" class="btn btn-success" onclick="AddAnswerOption()"> <i class="glyphicon glyphicon-plus"></i> Add Option</button>\
                                           </div>\
                                           <div class="hide" id="add-answer-field">\
                                            <table class="table">\
                                              <tr>\
                                               <td align="left">\
                                               <input type="radio" name="answer" />\
                                              </td>\
                                              <td>\
                                               <input type="text" name="options[]" class="form-control" onblur="AddValueToAnwerRadio(this)" />\
                                              </td>\
                                              <td align="right">\
                                               <i class="glyphicon glyphicon glyphicon-trash" onclick="RemoveAnswerOption(this)"></i>\
                                              </td>\
                                             </tr>\
                                            </table>\
                                           </div>\
                                          </div>';

                        var popup_buttons = '<button type="button" class="btn btn-primary" data-question="' + QuestionDetail.question_id + '" onclick="SaveQuestionDetail(this)">Update Question</button>\
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';

                        $("#QuestionModal #ModalTitle").html("Update Question");
                        $("#QuestionModal .modal-body").html(popup_html);
                        $("#QuestionModal .modal-footer").html(popup_buttons);
                        $('#QuestionModal').modal('show');
                    }
                },
                error: function (data) {
                    alert(data.d.Message);
                }
            });
        }


        function OpenAddQuestionPopup() {
            var popup_html = '<div  id="message"> </div>\
                        <div class="form-group">\
							<label for="txtAddQuestion">Question </label>\
							<input type="text" id="txtQuestion" class="form-control" placeholder="Question" />\
						</div>\
						<div class="form-group">\
							<label for="txtAddQuestion">Answer Options </label>\
						</div>\
						<div class="answer-options-container">\
							<table class="table answer-options">\
								<tr>\
									<td align="left">\
										<input type="radio" name="answer" />\
									</td>\
									<td>\
										<input type="text" name="options[]" class="form-control" onblur="AddValueToAnwerRadio(this)" />\
									</td>\
									<td align="right"></td>\
								</tr>\
								<tr>\
									<td align="left">\
										<input type="radio" name="answer" />\
									</td>\
									<td>\
										<input type="text" name="options[]" class="form-control" onblur="AddValueToAnwerRadio(this)" />\
									</td>\
									<td align="right"></td>\
								</tr>\
							</table>\
							<div class="text-center">\
								<button type="button" class="btn btn-success" onclick="AddAnswerOption()"> <i class="glyphicon glyphicon-plus"></i> Add Option</button>\
							</div>\
							<div class="hide" id="add-answer-field">\
								<table class="table">\
										<tr>\
											<td align="left">\
											<input type="radio" name="answer" />\
										</td>\
										<td>\
											<input type="text" name="options[]" class="form-control" onblur="AddValueToAnwerRadio(this)" />\
										</td>\
										<td align="right">\
											<i class="glyphicon glyphicon glyphicon-trash" onclick="RemoveAnswerOption(this)"></i>\
										</td>\
									</tr>\
								</table>\
							</div>\
						</div>';

            var popup_buttons = '<button type="button" class="btn btn-primary" onclick="SaveQuestionDetail(this)">Save Question</button>\
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';

            $("#QuestionModal #ModalTitle").html("Add Question");
            $("#QuestionModal .modal-body").html(popup_html);
            $("#QuestionModal .modal-footer").html(popup_buttons);
            $('#QuestionModal').modal('show');

        }

        function AddAnswerOption() {
            var OptionsCount = $(".answer-options-container .answer-options tr").length;
            if (OptionsCount < 5) {
                var OptionRow = $("#add-answer-field .table tbody").html();
                $(".answer-options-container .answer-options").append(OptionRow);
            }
            else {
                $("#message").html("Only five additional fields are allowed!").addClass("alert alert-danger");

            }
        }

        function RemoveAnswerOption(element) {
            var OptionId = $(element).attr('data-option');
            var QuestionId = $(element).attr('data-question');
            
            if (QuestionId && QuestionId.length > 0 && OptionId && OptionId > 0) {
                var confirmaion = confirm("Do you want to remove option?");
                if (confirmaion) {
                    debugger;
                    if ($("input[data-option='" + OptionId + "']").is(":checked")) {                       
                        $("#message").html("You can't delete option that is checked").addClass("alert alert-danger");
                        return false;
                    }

                    $.ajax({
                        url: 'questions.aspx/DeleteOption',
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        data: '{question_id :"' + QuestionId + '",option_id:"' + OptionId + '"}',
                        success: function (data) {
                            if (data.d.Success == true) {
                                $(element).parent().parent().remove();
                                $("#message").html(data.d.Message).addClass("alert alert-success");
                                setTimeout(function () {
                                    $("#QuestionModal").modal("hide");
                                }, 2000);
                                GetSurveyQuestionList();
                            } else {
                                alert(data.d.Message);
                               
                            }
                        },
                        error: function (data) {
                            alert(data.d.Message);
                        }
                    });
                }
            } else {
                $(element).parent().parent().remove();
            }
        }

        function AddValueToAnwerRadio(element) {
            if ($(element).val() != "") {
                $(element).parent().parent().find("input[name='answer']").val($(element).val());
            }
        }

        function SaveQuestionDetail(element) {
            var ValidationCheck = CheckValidations();

            if (ValidationCheck) {
                var PostDataRequest = {};
                PostDataRequest["question_id"] = $(element).attr('data-question');
                PostDataRequest["question_text"] = $("#txtQuestion").val();

                var AnswerRadioValue = $(".answer-options input[name='answer']:checked").val();

                var AnswerOptions = [];
                var OptionSelector = $(".answer-options input[name='options[]']");


                OptionSelector.each(function () {
                    var OptionValue = $(this).val();
                    var OptionId = $(this).attr('data-option');

                    var AnswerOption = {};
                    AnswerOption["option_id"] = OptionId;
                    AnswerOption["option_text"] = OptionValue;

                    if (AnswerRadioValue == OptionValue) {
                        AnswerOption["is_correct"] = true;
                    } else {
                        AnswerOption["is_correct"] = false;
                    }

                    AnswerOptions.push(AnswerOption);
                });

                PostDataRequest["Options"] = AnswerOptions;

                var params = "{'SaveQuestionRequest': '" + JSON.stringify(PostDataRequest) + "'}";
                $.ajax({
                    url: "questions.aspx/SaveQuestion",
                    type: "post",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: params,
                    success: function (data) {
                        if (data.d.success = true) {
                            $("#message").html(data.d.Message).addClass("alert alert-success");
                            setTimeout(function () {
                                $("#QuestionModal").modal("hide");
                            }, 2000);
                        
                             GetSurveyQuestionList();
                        }
                        else
                        {
                            $("#message").html(data.d.Message).addClass("alert alert-danger");
                        }
                      
                    }
                });
            }
        }

        function CheckValidations() {
            debugger;
            var Question = $("#txtQuestion").val();

            if (Question == "") {               
                $("#message").html("Question is required.").addClass("alert alert-danger");
                return false;
            }

            var OptionsFilled = true;
            var OptionSelector = $(".answer-options input[name='options[]']");

            OptionSelector.each(function () {
                if ($(this).val() == "") {
                    OptionsFilled = false;
                    return false;
                }
            });

            if (!OptionsFilled) {               
                $("#message").html("Please fill all option fields.").addClass("alert alert-danger");
                return false;
            }

            if (OptionSelector.length < 2 || OptionSelector.length > 5) {
                $("#message").html("Please add minimum two options and maximum five options of question.").addClass("alert alert-danger");
                return false;
            }

            var IsAnswerRadioChecked = $(".answer-options input[name='answer']").is(":checked");

            if (!IsAnswerRadioChecked) {
                $("#message").html("Please select answer of question.").addClass("alert alert-danger");

                return false;
            }
            return true;
        }

    </script>
</asp:Content>
 

