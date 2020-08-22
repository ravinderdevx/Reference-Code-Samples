const { Configuration, Webinar, TopVideo, ContactUs, EmailTemplate, Domain, Course, Subject, Chapter, Topic, SubTopic, Section, Enrollment, VideoListing } = require('../db');
const { getConfigurationValue, sendMailUsingEmailTemplate, getWebinarDetailById } = require('./common/general');
const MESSAGES = require("../common/static/messages")
// const { ContactUs, Configuration, Webinar, Domain, Course, Subject, Chapter, Topic, SubTopic, Section, TopVideo } = require('../db');

class CommonService {
    async configurationSeeders() {
        Configuration.collection.drop();
        const configData = await Configuration.findOne({ ConfigKey: 'HOME-SLIDER', IsActive: true, IsDeleted: false });
        if (configData == null) {
            const configuration = new Configuration({
                ConfigKey: "HOME_SLIDER",
                ConfigValue: [{ "Heading": "JackFruit", "SubHeading": "UNLOCK YOUR LEARNING SUPER POWERS WITH", "Path": "/assets/images/banner2.jpg" }],
                CreatedBy: "parshant dutta"
            });
            await configuration.save();

            const configuration1 = new Configuration({
                ConfigKey: "SITE_URL",
                ConfigValue: "http://132.148.16.108",
                CreatedBy: "parshant dutta"
            });
            await configuration1.save();
        }
        Domain.collection.drop();
        Course.collection.drop();
        Subject.collection.drop();
        Chapter.collection.drop();
        Topic.collection.drop();
        SubTopic.collection.drop();
        Section.collection.drop();
        Webinar.collection.drop();

        const webinardata = await Webinar.findOne({ IsActive: true, IsDeleted: false, DateTime: { $gte: new Date } });
        if (webinardata == null) {

            const domain = new Domain({
                Name: "CBSE",
                CreatedBy: "parshant dutta"
            });
            await domain.save();

            const course = new Course({
                Name: "10th",
                CreatedBy: "parshant dutta"
            });
            await course.save();

            const subject = new Subject({
                Name: "Chemistry",
                CreatedBy: "parshant dutta"
            });
            await subject.save();

            const chapter = new Chapter({
                Name: "Carbon and Its Compounds",
                CreatedBy: "parshant dutta"
            });
            await chapter.save();

            const topic = new Topic({
                Name: "Carbon Topic",
                CreatedBy: "parshant dutta"
            });
            await topic.save();

            const subTopic = new SubTopic({
                Name: "Compounds Sub-Topic",
                CreatedBy: "parshant dutta"
            });
            await subTopic.save();

            const section = new Section({
                Name: "Introduction and importance of Carbon and its Compounds",
                CreatedBy: "parshant dutta"
            });
            await section.save();

            var today = new Date();
            var newdate = new Date();
            newdate.setDate(today.getDate() + 10);

            const Webinars = new Webinar({
                Name: "Carbon Compounds",
                Slug: "carbon-compounds",
                Tags:["carbons and its compounds","chemistry","science","class 10th","ncert",
                "cbse", "carbon and its compounds class 10","carbon and its compounds class 10 in hindi",
                "class 10 chemistry carbon and its compounds","class 10 science","carbon and its compound in hindi"],
                DateTime: "2019-03-16 23:10:24.008",
                Domain: domain._id,
                Course: course._id,
                Subject: subject._id,
                //Chapter: chapter._id,
                // Topic: topic._id,
                // SubTopic: subTopic._id,
                //Section: section._id,
                CreatedBy: "parshant dutta"
            });
            await Webinars.save();

            const Webinars2 = new Webinar({
                Name: "Periodic Classification",
                Slug: "periodic-classification",
                Tags:["carbons and its compounds","chemistry","science","class 10th","ncert",
                "cbse", "Periodic Classification class 10","Periodic Classification class 10 in hindi",
                "class 10 chemistry Periodic Classification","class 10 science","carbon and its compound in hindi"],
                DateTime: "2019-03-16 23:10:24.008",
                Domain: domain._id,
                Course: course._id,
                // Subject: subject._id,
                Chapter: chapter._id,
                // Topic: topic._id,
                // SubTopic: subTopic._id,
                Section: section._id,
                CreatedBy: "parshant dutta"
            });
            await Webinars2.save();

            const videoListing = new VideoListing({
                Name: "Carbon Compounds",
                Description: "carbon-compounds",
                VideoYouTubeId: "71YuaiUXZAw",
                Tags:["carbons and its compounds","chemistry","science","class 10th","ncert",
                "cbse", "carbon and its compounds class 10","carbon and its compounds class 10 in hindi",
                "class 10 chemistry carbon and its compounds","class 10 science","carbon and its compound in hindi"],
                DateTime: "2019-03-16 23:10:24.008",
                Domain: domain._id,
                Course: course._id,
                Subject: subject._id,
                Chapter: chapter._id,
                Topic: topic._id,
                SubTopic: subTopic._id,
                Section: section._id,
                CreatedBy: "parshant dutta"
            });
            await videoListing.save();

        }

        const TopVideoData = await TopVideo.findOne({ IsActive: true, IsDeleted: false });
        if (TopVideoData == null) {
            const topVedios = TopVideo.collection.insertMany([{
                VideoYouTubeId: "IolH5-zD_Nk",
                ThumbImage: "/assets/images/videothumbs/electricitycolumbs.jpg",
                IsActive: true,
                IsDeleted: false,
                CreatedOn: Date.now(),
                CreatedBy: "parshant dutta"
            },
            {
                VideoYouTubeId: "w7_Gv_ZyEwI",
                ThumbImage: "/assets/images/videothumbs/domenstic1.jpg",
                IsActive: true,
                IsDeleted: false,
                CreatedOn: Date.now(),
                CreatedBy: "parshant dutta"
            },
            {
                VideoYouTubeId: "LvvE3rGCaFU",
                ThumbImage: "/assets/images/videothumbs/earthing1.jpg",
                IsActive: true,
                IsDeleted: false,
                CreatedOn: Date.now(),
                CreatedBy: "parshant dutta"
            },
            {
                VideoYouTubeId: "gxTOqZb_8xc",
                ThumbImage: "/assets/images/videothumbs/ncert1.jpg",
                IsActive: true,
                IsDeleted: false,
                CreatedOn: Date.now(),
                CreatedBy: "parshant dutta"
            },
            {
                VideoYouTubeId: "wqGRMGyxcAA",
                ThumbImage: "/assets/images/videothumbs/right-hand-thumb1.jpg",
                IsActive: true,
                IsDeleted: false,
                CreatedOn: Date.now(),
                CreatedBy: "parshant dutta"
            }]);
        }

        const Emaildata = await EmailTemplate.findOne({ IsActive: true, IsDeleted: false });
        if (Emaildata == null) {
            const Template = new EmailTemplate({
                TemplateName: "FORGOT_PASSWORD_TEMPLATE",
                Subject: "Forgot password",
                Template: `<html> <head> <meta charset="utf-8"> <title>Jackfruit: Reset Passeord</title> <link rel="stylesheet" href="style1.css" type="text/css"/> <link href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i" rel="stylesheet"> </head> <body style="margin: 0px;padding: 0px;background-color: #ddd;font-family: 'Lato', sans-serif;"> <div id="page" style="width:48%; margin: 0 auto;"> <div style="padding:30px;background:url({bgimageurl});background-repeat:no-repeat;background-size: 100% 100%;height:1000px;position: relative;min-height:1000px;"> <div style="text-align:left;margin:0;width: 28%;"><img style="max-width: 100%;" src="{logourl}" alt="image" title="Logo"/></div> <div style="position: absolute;right: 50px;top: 39%;transform: translateY(-39%);text-align: right;"><h1 style="font-size: 28px;line-height:66px;color:#3e441e;margin:0;font-weight:400;">Forgot Password?</h1></div> <div style="text-align: center; position: absolute; top: 58%;transform: translateY(-58%) translateX(-50%);width: 100%;left: 50%;"> <h2  style="font-size: 20px;line-height: 22px;color: #000000;margin: 0 0 30px 0;font-weight: 400;">Not to worry. We got you! Letâ€™s get a new password.</h2> <a href="{url}" target="_blank" title="Reset Password" style="padding:10px 20px;text-transform: uppercase;font-size:17px;line-height:14px;font-weight:300;font-family:'Lato', sans-serif;border-radius:4px;letter-spacing:1px;margin: 0 0 12px;display:inline-block;background-color:#2d3600;border-color:#2d3600;color:#fff;cursor: pointer;text-decoration:none;">Reset Password</a> </div> </div> </div> </body> </html>`,
                CreatedBy: "parshant dutta"
            });

            await Template.save();

            const Template1 = new EmailTemplate({
                TemplateName: "EMAIL_VERIFICATION_TEMPLATE",
                Subject: "Email Verification",
                Template: `<html> <head> <meta charset="utf-8"> <title>Jackfruit: Email Verification</title> <link href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i" rel="stylesheet"> </head> <body style="margin: 0px;padding: 0px;background-color: #ddd;font-family: 'Lato', sans-serif;"> <div id="page" style="width:48%; margin: 0 auto;"> <div style="padding:30px;background:url({bgimageurl});background-repeat:no-repeat;background-size:cover;"> <div style="text-align:center;margin: 0 auto 25px;width: 26%;"><img style="max-width: 100%;" src="{logourl}" alt="image" title="logo"/></div> <div style="background:url({bgimage2url});background-repeat:no-repeat;background-size:100% 100%;height:638px;width: 100%;margin:0 auto;display:inline-block;"> <div style="background-color:#f4fee7;width:80%;margin: 50px auto;text-align:center;"> <h1 style="font-size: 28px;line-height:66px;color:#3e441e;margin:0;font-weight:400;">Hi {name},</h1> <h2 style="font-size: 20px;line-height: 22px;color: #000000;margin: 0 0 30px 0;font-weight: 400;">Please click <a href='{url}' target='_blank'>here</a> to verify email.</h2> <div style="width: 100px;height: 100px; display: inline-block;background-color: #eef5e6;border-radius: 50%;line-height: 100px; margin: 0 0 18px 0;"><img style="vertical-align: middle;" src="{successimageurl}" alt="image" title="Success"/></div> <p style="max-width: 350px;margin: 0 auto 12px;font-size: 16px;line-height: 22px;color: #000;font-weight: 400;"></p> <a style="padding: 10px 20px;text-transform: uppercase;font-size: 17px;line-height:14px;font-weight:300;font-family:'Lato', sans-serif;  border-radius:4px;letter-spacing:1px;margin: 0 0 12px;display:inline-block;background-color: #2d3600;border-color:#2d3600;color:#fff;" title="Start Learning">Start Learning</a> <div style="width: auto;display: block;min-height: 33px;"> <ul style="margin: 0px;padding:0px;list-style: none;"><li style="width: auto;display: inline-block;margin: 0 13px 0 0;"><a href="https://www.facebook.com/Jackfruitedu/" target="_blank"><img src="{fbimageurl}" alt="image" title="Facebook"/></a></li><li style="width: auto;display: inline-block;margin: 0 13px 0 0;"><a href="#"><img src="{twitterimageurl}" alt="image" title="Twitter"/></a></li> <li style="width: auto;display: inline-block;margin: 0 0 0 0;"><a href="https://www.youtube.com/c/JackFruitEdu" target="_blank"><img src="{youtubeimageurl}" alt="image" title="Youtube"/></a></li> </ul></div></div></div></div></div></body> </html>`,
                CreatedBy: "parshant dutta"
            });
            await Template1.save();

            const Template2 = new EmailTemplate({
                TemplateName: "ENROLLMENT_TEMPLATE",
                Subject: "JackFruit Webinar Ennrollment",
                Template: `hi {name}, \n
                \t You are successfully enrolled for the {webinarname} webinar held on {webinardatetime} . \n\n
                Thank you \n 
                JackFruit Team`,
                CreatedBy: "parshant dutta"
            });
            await Template2.save();
        }

        console.log('end of seeders');
        const result = {};

        return result;
    };

    async getConfigurationTableValue(configKey) {
        return getConfigurationValue(configKey);
    };

    async getUpcomingWebinarDetails() {
        const webinardata = await Webinar.find({
            IsActive: true,
            IsDeleted: false,
            DateTime: {
                $gte: new Date()
            }
        })
            .populate('Domain', '_id Name')
            .populate('Course', '_id Name')
            .populate('Subject', '_id Name')
            .populate('Chapter', '_id Name')
            .populate('Topic', '_id Name')
            .populate('SubTopic', '_id Name')
            .populate('Section', '_id Name');

        return webinardata;
    };

    async getTopVideos() {
        const TopVideoData = TopVideo.find({
            IsActive: true,
            IsDeleted: false
        }).limit(5);

        return TopVideoData;
    };

    async contactUs(contactInfo) {
        const contactUsData = new ContactUs({
            Name: contactInfo.Name,
            Email: contactInfo.Email,
            PhoneNumber: contactInfo.PhoneNumber,
            Message: contactInfo.Message,
            CreatedBy: contactInfo.Name
        });

        await contactUsData.save();

        console.log(contactUsData);

        return { message: MESSAGES.SUCCESS_MESSAGES.CONTACT_MESSAGE };
    };

    async enrollNow(enrollInfo) {
        const enrollNowData = new Enrollment({
            Webinar: enrollInfo.WebinarId,
            Name: enrollInfo.Name,
            Email: enrollInfo.Email,
            PhoneNumber: enrollInfo.PhoneNumber,
            Questions: enrollInfo.Questions,
            CreatedBy: enrollInfo.Name
        });

        await enrollNowData.save();

        const webinarDetail = await getWebinarDetailById(enrollInfo.WebinarId);

        const dataObject = {
            name: enrollInfo.Name,
            webinarname: webinarDetail.Name,
            webinardatetime: new Date(webinarDetail.DateTime).toString().replace(/T/, ' ').replace(/\..+/, '')
        };
        const mailObject = {
            recipients: [{
                Email: enrollInfo.Email
            }]
        };
        // Send Enrollment Email
        sendMailUsingEmailTemplate('ENROLLMENT_TEMPLATE', dataObject, mailObject);

        return { message: MESSAGES.SUCCESS_MESSAGES.ENROLL_MESSAGE };
    };

    async getWebinarDetailBySlug(webinarSlug) {
        const webinardata = await Webinar.findOne({
            IsActive: true,
            IsDeleted: false,
            Slug: webinarSlug
        }).populate('Domain Course Subject Chapter Topic SubTopic Section', 'Name');

        if (!webinardata)
            ThrowException({ name: 'customError', message: `Webinar does not exist` });

        return { data: webinardata.toJSON() };
    };

    async getVideoListingBySeachText(searchtext) {
        console.log(searchtext);
        // let data = await Webinar
        //     .populate('Domain Course Subject Chapter Topic SubTopic Section', 'Name Name Name Name Name Name')
        //     .find({
        //         IsActive: true,
        //         IsDeleted: false,
        //         $or: [
        //             { Name: { $regex: searchtext, $options: "i" } },
        //             { Slug: { $regex: searchtext, $options: 'i' } }
        //         ]
        //     });

        let response = {
            webinar: [],
            videoListing: []
        };

        response.webinar = await Webinar.aggregate([
            // Join with Domain table
            {
                $lookup: {
                    from: Domain.collection.name,
                    localField: "Domain",
                    foreignField: "_id",
                    as: "Domain"
                }
            },
            // Join with Course table
            {
                $lookup: {
                    from: Course.collection.name,
                    localField: "Course",
                    foreignField: "_id",
                    as: "Course"
                }
            },
            // Join with Subject table
            {
                $lookup: {
                    from: Subject.collection.name,
                    localField: "Subject",
                    foreignField: "_id",
                    as: "Subject"
                }
            },
            // Join with Chapter table
            {
                $lookup: {
                    from: Chapter.collection.name,
                    localField: "Chapter",
                    foreignField: "_id",
                    as: "Chapter"
                }
            },
            // Join with Topic table
            {
                $lookup: {
                    from: Topic.collection.name,
                    localField: "Topic",
                    foreignField: "_id",
                    as: "Topic"
                }
            },
            // Join with SubTopic table
            {
                $lookup: {
                    from: SubTopic.collection.name,
                    localField: "SubTopic",
                    foreignField: "_id",
                    as: "SubTopic"
                }
            },
            // Join with Section table
            {
                $lookup: {
                    from: Section.collection.name,
                    localField: "Section",
                    foreignField: "_id",
                    as: "Section"
                }
            },
            {
                $match: {
                    IsActive: true,
                    IsDeleted: false,
                    $or: [
                        { Name: { $regex: searchtext, $options: "i" } },
                        { Description: { $regex: searchtext, $options: "i" } },
                        { Tags: { $regex: searchtext, $options: "i"  } },
                        { "Domain.Name": { $regex: searchtext, $options: "i" } },
                        { "Course.Name": { $regex: searchtext, $options: "i" } },
                        { "Subject.Name": { $regex: searchtext, $options: "i" } },
                        { "Chapter.Name": { $regex: searchtext, $options: "i" } },
                        { "Topic.Name": { $regex: searchtext, $options: "i" } },
                        { "SubTopic.Name": { $regex: searchtext, $options: "i" } },
                        { "Section.Name": { $regex: searchtext, $options: "i" } }
                    ]
                } 
            }
        ]);

        response.videoListing = await VideoListing.aggregate([
            // Join with Domain table
            {
                $lookup: {
                    from: Domain.collection.name,
                    localField: "Domain",
                    foreignField: "_id",
                    as: "Domain"
                }
            },
            // Join with Course table
            {
                $lookup: {
                    from: Course.collection.name,
                    localField: "Course",
                    foreignField: "_id",
                    as: "Course"
                }
            },
            // Join with Subject table
            {
                $lookup: {
                    from: Subject.collection.name,
                    localField: "Subject",
                    foreignField: "_id",
                    as: "Subject"
                }
            },
            // Join with Chapter table
            {
                $lookup: {
                    from: Chapter.collection.name,
                    localField: "Chapter",
                    foreignField: "_id",
                    as: "Chapter"
                }
            },
            // Join with Topic table
            {
                $lookup: {
                    from: Topic.collection.name,
                    localField: "Topic",
                    foreignField: "_id",
                    as: "Topic"
                }
            },
            // Join with SubTopic table
            {
                $lookup: {
                    from: SubTopic.collection.name,
                    localField: "SubTopic",
                    foreignField: "_id",
                    as: "SubTopic"
                }
            },
            // Join with Section table
            {
                $lookup: {
                    from: Section.collection.name,
                    localField: "Section",
                    foreignField: "_id",
                    as: "Section"
                }
            },
            { 
                $match: {
                    IsActive: true,
                    IsDeleted: false,
                    $or: [
                        { Name: { $regex: searchtext, $options: "i" } },
                        { Description: { $regex: searchtext, $options: "i" } },
                        { Tags: { $regex: searchtext, $options: "i"  } },
                        { "Domain.Name": { $regex: searchtext, $options: "i" } },
                        { "Course.Name": { $regex: searchtext, $options: "i" } },
                        { "Subject.Name": { $regex: searchtext, $options: "i" } },
                        { "Chapter.Name": { $regex: searchtext, $options: "i" } },
                        { "Topic.Name": { $regex: searchtext, $options: "i" } },
                        { "SubTopic.Name": { $regex: searchtext, $options: "i" } },
                        { "Section.Name": { $regex: searchtext, $options: "i" } }
                    ]
                }
            }
        ]);

        // if (!data)
        //     ThrowException({ name: 'customError', message: `VedioListing does not exist` });
        return response;
    };

}

module.exports = new CommonService();