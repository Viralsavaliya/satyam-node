import { NextFunction, Request, Response } from "express";
import commonUtils, { fileFilter, commonFileStorage } from "../../utils/commonUtils";
import { AppStrings } from "../../utils/appStrings";
import Auth from "../../auth/index";
import mongoose from "mongoose";
import commoncontroller from "../common/commoncontroller";
const ejs = require('ejs');
const pdf = require('html-pdf');

const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const config = require("config");
const Admin = require("./models/adminModel");
const Work = require("./models/workModel");
const User = require("../user/userModel");
const HunterTip = require("./models/huntertipsModel");
const BIL = require("./models/huntertipsModel");
const Techniques = require("./models/techniquesModel");
const Post = require("../post/postModel");
const Tutorial = require("./models/tutorialsModel");
const Item = require("./models/tutorialsModel");
const PromoCode = require("./models/promocodeModel");
const SavedPostFolder = require("../post/savedPostFolderModel");
const Subscription = require("../subscription/subscriptionModel");
const UserSubscription = require("../subscription/userSubscriptionModel");
const Notification = require("../notification/notificationModel");
const supportTicket = require("../supportTicket/supportTicketModel");
const reportPost = require("../report/reportPostModel");
const reportUser = require("../report/reportUserModel");
const multer = require("multer");

async function register(req: Request, res: Response) {
  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    status: 1,
  });

  // hash password
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);

  await admin.save();
  return commonUtils.sendAdminSuccess(req, res, { message: "Admin Register successfully", id: admin._id }, 200);
}

const getProfile = async (req: any, res: Response) => {
  const adminId = req?.headers?.userid || "";
  const pipline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(adminId),
      },
    },
    {
      $project: {
        _id: 1,
        name: "$name",
        id: "$_id",
        email: "$email",
        mobile: "$mobile",
        image: "$image"
      },
    },
  ];
  const admin = await Admin.aggregate(pipline);
  return commonUtils.sendAdminSuccess(req, res, admin.length ? admin[0] : {});
};

async function login(req: Request, res: Response) {
  try {
    const email = req.body.email ? req.body.email : "";
    const password = req.body.password;
    const social_id = req.body.social_id;
    const login_type = req.body.login_type;

    if (!email) return commonUtils.sendError(req, res, { message: AppStrings.EMAIL_MOBILE_REQUIRED }, 409);

    const user = await Admin.findOne({ email: email });

    if (!user && social_id)
      return commonUtils.sendSuccess(req, res, { is_register: false }, 200); //need to reg

    if (!user) return commonUtils.sendError(req, res, { message: AppStrings.USER_CREDENTIAL_DOES_NOT_MATCH }, 409);
    user.pushToken = req.body.pushToken || null;
    await user.save();

    if (social_id && user.social_id == null) {
      user.social_id = social_id ? social_id : user.social_id;
      user.login_type = login_type ? login_type : user.login_type;
      await user.save();
    }

    if (social_id && user.social_id != social_id) {
      return commonUtils.sendError(req, res, { message: "sorry You are not owner of this account!" }, 409);
    }

    if (user.status != 1) return commonUtils.sendError(req, res, { message: AppStrings.USER_DEACTIVATE }, 409);


    // if (!user.is_verify) return commonUtils.sendError(req, res, { message: "verify your email befor login!" }, 409);

    // let hostname = req.headers.host;
    // query.is_verify = true;
    // const isVerified = await User.findOne(query);
    // if (!isVerified) {
    //     await SendEmailVarification(email, user.fullname, hostname);
    //     return commonUtils.sendError(req, res, { message: "User is not varified!" }, 409);
    // }
    if (password) {
      const valid_password = await bcrypt.compare(password, user.password);
      if (!valid_password) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return commonUtils.sendError(req, res, { message: AppStrings.INVALID_PASSWORD }, 409);
      }
    }

    const response_ = await Auth.adminLogin(user._id, user.createdAt);

    res.cookie("accessToken", response_.accessToken, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie("refreshToken", response_.refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });

    const token = {
      accessToken: response_.accessToken,
      refreshToken: response_.refreshToken,
      user,
    }; // user is already reg no need to reg
    return commonUtils.sendSuccess(req, res, token, 200);
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

const updateProfile = async (req: any, res: Response) => {
  const adminId = req?.headers?.userid;
  console.log(req?.body, "adminId");

  const admin = await Admin.findById(adminId);
  if (!admin) return commonUtils.sendError(req, res, { message: AppStrings.ADMIN_NOT_FOUND }, 409);
  const { image } = req.body;
  const name = req.body?.name || admin.name;
  const email = req.body?.email || admin.email;
  const mobile = req.body?.mobile || admin.mobile;
  const images = req.body?.image || admin.image;
  admin.name = name;
  admin.email = email;
  // admin.mobile = mobile;

  if (image) {
    if (admin.image) {
      var filename = path?.basename(admin?.image);
      if (fs.existsSync("uploads/admin/" + filename) && filename != "") {
        fs.unlinkSync("uploads/admin/" + filename);
        admin.image = images;
      }
    }
  }

  await admin.save();
  await admin.updateOne({ name: name, email: email, mobile: mobile, image: image }).exec(); return commonUtils.sendSuccess(req, res, { message: AppStrings.PROFILE_UPDATED }, 200);
};

const changePassword = async (req: any, res: Response) => {
  const adminId = req?.headers?.userid;

  const old_password = req.body.old_password;
  const new_password = req.body.new_password;

  const admin = await Admin.findById(adminId);

  if (!admin) return commonUtils.sendError(req, res, { message: AppStrings.USER_NOT_FOUND }, 409);

  const valid_password = await bcrypt.compare(old_password, admin.password);
  if (!valid_password) return commonUtils.sendError(req, res, { message: AppStrings.OLD_PASSWORD_INVALID }, 409);

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(new_password, salt);
  await admin.updateOne({ password: admin.password }).exec();

  return commonUtils.sendSuccess(req, res, { message: AppStrings.PASSWORD_CHANGED }, 200);
};

async function dashboard(req: Request, res: Response) {
  try {

    const TotalUser = await User.countDocuments();
    const SubscriberUser = await User.countDocuments({ is_subscription: 1 });
    const FreeUser = await User.countDocuments({ is_subscription: 0 });
    const price = await Subscription.findOne();

    const usersubsctiptiontotal = await UserSubscription.countDocuments({ payment_status: 1, coupon_id: { $ne: null } });
    const usersubsctiptiontotalall = await UserSubscription.countDocuments({ payment_status: 1, coupon_id: null });
    const discountPercentage = 10; // 10% discount
    const discount = (price?.price * discountPercentage) / 100;
    const discountedPrice = price?.price - discount;
    const totalpayment = (usersubsctiptiontotal * discountedPrice) + (usersubsctiptiontotalall * price?.price)

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const usersubsctiptiontotaltoday = await UserSubscription.countDocuments({
      payment_status: 1, coupon_id: { $ne: null }, createdAt: { $gte: startOfDay, $lt: endOfDay }
    });
    const usersubsctiptiontotalalltoday = await UserSubscription.countDocuments({
      payment_status: 1, coupon_id: null, createdAt: { $gte: startOfDay, $lt: endOfDay }
    });
    const discountPercentagetoday = 10;
    const discounttoday = (price?.price * discountPercentagetoday) / 100;
    const discountedPricetoday = price?.price - discounttoday;
    const totalpaymenttoday =
      usersubsctiptiontotaltoday * discountedPricetoday + usersubsctiptiontotalalltoday * price?.price;


    const supportticket = await supportTicket.countDocuments({ status: 1, });

    const todaytotaluser = await User.countDocuments({ createdAt: { $gte: startOfDay, $lt: endOfDay } });
    const TodayPaidUser = usersubsctiptiontotaltoday + usersubsctiptiontotalalltoday

    const transactionhistory = await UserSubscription.countDocuments();


    const user = {
      TotalUser,
      FreeUser,
      totalpayment,
      totalpaymenttoday,
      SubscriberUser,
      supportticket,
      todaytotaluser,
      TodayPaidUser,
      transactionhistory
    };

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching status-wise count:", error);
    return res.status(500).json({ error: "Failed to fetch status-wise count" });
  }
}

const userList = async (req: any, res: Response) => {
  console.log(1111);
  const { serach } = req.query;
  console.log(serach);

  const user = await User.find({
    $or: [
      { name: new RegExp(serach, "i") },
      { mobile: new RegExp(serach, "i") },
      { mobile2: new RegExp(serach, "i") },
      { carnumber: new RegExp(serach, "i") },
      { email: new RegExp(serach, "i") },
    ],
  })
    .sort({ createdAt: "desc" });
  return commonUtils.sendSuccess(req, res, user);
};

const allUserList = async (req: any, res: Response) => {
  const user = await User.find().select(
    "_id firstName lastName companyName email mobile type"
  );
  return commonUtils.sendSuccess(req, res, user);
};

const brokerList = async (req: any, res: Response) => {
  const user = await User.find({
    type: 1,
    $or: [{ mainUserId: { $exists: false } }, { mainUserId: null }],
  })
    .select(
      "_id firstName lastName companyName mcNumber email mobile isApprove type createdAt"
    )
    .sort({ createdAt: "desc" });
  return commonUtils.sendSuccess(req, res, user);
};

const changeUserStatus = async (req: any, res: Response) => {
  const { userid, status } = req.body;
  try {
    const user = await User.findOne({ _id: userid });

    if (!user) {
      return commonUtils.sendError(req, res, { message: AppStrings.USER_NOT_FOUND }, 404);
    }

    let newStatus;

    switch (status) {
      case 0:
        newStatus = 1;
        break;
      case 1:
        newStatus = 0;
        break;
      default:
        return commonUtils.sendError(
          req,
          res,
          { message: AppStrings.INVALID_STATUS },
          400
        );
    }

    // Update the user's isApprove status
    user.status = newStatus;
    await user.save();

    return commonUtils.sendSuccess(req, res, user);
  } catch (error) {
    console.error("Error updating user approval status:", error);
    return commonUtils.sendError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 500);
  }
};

const carrierSubUserList = async (req: any, res: Response) => {
  const userId = req.query.id as string;
  const subUser = await User.find({ mainUserId: userId }).select(
    "_id firstName lastName companyName dotNumber mcNumber email mobile type createdAt"
  );
  if (!subUser) {
    return commonUtils.sendError(req, res, { message: AppStrings.USER_NOT_FOUND }, 409);
  }
  return commonUtils.sendSuccess(req, res, subUser);
};

const WorkList = async (req: any, res: Response) => {
  const user = await Work.find().select(
    "_id humanimage deerimage description createdAt"
  );
  return commonUtils.sendSuccess(req, res, user);
};

const CreateWork = async (req: any, res: Response) => {
  try {
    const { humanimage, deerimage, description } = req.body;
    let work = await new Work({
      humanimage,
      deerimage,
      description,
    });
    await work.save();
    return commonUtils.sendSuccess(req, res, { message: "Work created successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

const Updatework = async (req: any, res: Response) => {
  const workid = req?.query?.id;
  console.log(workid);


  const work = await Work.findById(workid);
  if (!work) return commonUtils.sendError(req, res, { message: AppStrings.WORK_NOT_FOUND }, 409);
  try {
    const { humanimage, deerimage, description } = req.body;

    const humanimg = humanimage || work.humanimage;
    const deerimg = deerimage || work.deerimage;
    const deer = description || work.description;

    if (humanimage) {
      var filename = path.basename(work.humanimage);
      if (fs.existsSync("uploads/admin/" + filename) && filename != "") {
        fs.unlinkSync("uploads/admin/" + filename);
        work.humanimage = humanimg;
      }
    }
    if (deerimage) {
      var filename = path.basename(work.deerimage);
      if (fs.existsSync("uploads/admin/" + filename) && filename != "") {
        fs.unlinkSync("uploads/admin/" + filename);
        work.deerimage = deerimg;
      }
    }

    work.humanimage = humanimg;
    work.deerimage = deerimg;
    if (!(humanimage || deerimage)) {
      work.description = deer;
    }

    await work.save();
    return commonUtils.sendSuccess(req, res, { message: "Work updated successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

const Deletework = async (req: any, res: Response) => {
  try {
    const deleteworkid = req?.query?.id;
    const deletedWork = await Work.findByIdAndDelete(deleteworkid);
    if (!deletedWork) {
      return res.status(404).json({ message: AppStrings.WORK_NOT_FOUND });
    }
    return commonUtils.sendSuccess(req, res, { message: "Work deleted successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

const getSharedPostList = async (req: any, res: Response) => {
  try {
    const user_id = req.params.id;

    const posts = await Post.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id)
        },
      },
      {
        $lookup: {
          from: 'savedsharedposts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'shared_post_data'
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post_id',
          as: 'like_data'
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comment_data'
        },
      },
      {
        $match: {
          'shared_post_data.type': 2,
        },
      },
      {
        $project: {
          _id: 1,
          image: 1,
          createdAt: 1,
          like_count: {
            $size: {
              $filter: {
                input: '$like_data',
                as: 'like',
                cond: { $eq: ['$$like.is_like', 1] }
              }
            }
          },
          commentCount: { $size: '$comment_data' }
        }
      }
    ])
    return commonUtils.sendSuccess(req, res, { posts: posts, sharedPostCount: posts.length }, 200);

  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

const getSavedPostList = async (req: any, res: Response) => {
  try {
    const user_id = req.params.id;

    const post = await Post.aggregate([
      {
        $match: {
          is_delete: 0
        },
      },
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: 'savedsharedposts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'saved_post_data'
        },
      },
      {
        $match: {
          'saved_post_data.type': 1,
        },
      },
      {
        $project: {
          image: 1,
          createdAt: 1
        }
      }
    ]);

    return commonUtils.sendSuccess(req, res, post, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}
const bilList = async (req: any, res: Response) => {

  const {id} = req.query
  // const user = await BIL.find({userId: new mongoose.Types.ObjectId(id)}).sort({ createdAt: -1 });
  const user = await BIL.aggregate([
    {
      $match:{
        userId: new mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user_data',
      },
    },
    {
      $unwind: {
        path: "$user_data",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 1,
        user:'$user_data',
        Allitem:1,
        billnumber:1,
        createdAt:1,
        millage:1
        },
      },
  ]);
  return commonUtils.sendSuccess(req, res, user);
};

async function getFacilityUniqId() {
  return new Promise(async (resolve, reject) => {
      let total_facility = await BIL.count();
      total_facility = total_facility + 1;
      let id = "000000"
      let generatedId = (id + total_facility).slice(-id.length);
      return resolve(generatedId)
  })
}
// const createBil = async (req: any, res: Response) => {
//   try {

//     console.log(req.body);
    
//     const { userId,bil } =
//       req.body;
//       let uniqeId: any = await getFacilityUniqId()
//     let huntertip = await new BIL({
//       userId,
//       Allitem:bil,
//       billnumber: uniqeId
//     });
//     await huntertip.save();

//     const ejsTemplate = await ejs.renderFile(
//       path.join(__dirname, '../pdf.ejs'),
//       huntertip
//     );

//     // Create PDF from the rendered HTML
//     const pdfOptions = { format: 'Letter' }; // Adjust options as needed
//     const pdfBuffer = await new Promise((resolve, reject) => {
//       pdf.create(ejsTemplate, pdfOptions).toBuffer((err: any, buffer: any) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(buffer);
//         }
//       });
//     });

//     // Set the response headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${uniqeId}.pdf`);

//     // Send the PDF buffer as the response
//     // res.send(pdfBuffer);

//     // Trigger the download using res.download
//     // res.download(pdfBuffer, `${uniqeId}.pdf`);

    
//     return commonUtils.sendSuccess(
//       req,
//       res,
//       { message: "Bil created successfully!" },
//       200
//     );
//   } catch (err: any) {
//     return commonUtils.sendError(req, res, { message: err.message }, 409);
//   }
// };

// const createBil = async (req: any, res: Response) => {
//   try {
//     console.log(req.body);

//     const { userId, bil } = req.body;
//     const uniqeId: any = await getFacilityUniqId();
//     const huntertip = new BIL({
//       userId,
//       Allitem: bil,
//       billnumber: uniqeId,
//     });
//     await huntertip.save();

//     const ejsTemplate = await ejs.renderFile(
//       path.join(__dirname, '../pdf.ejs'),
//       huntertip
//     );

//   //   <!-- <ul>
//   //   <% bil.checkedItems.forEach(item => { %>
//   //     <li><%= item.item %> - <%= item.amount %></li>
//   //   <% }) %>
//   // </ul> -->
//   // <!-- <p>Total: <%= bil.total %></p> -->

//     // Create PDF from the rendered HTML
//     const pdfOptions = { format: 'Letter' };
//     const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
//       pdf.create(ejsTemplate, pdfOptions).toBuffer((err: any, buffer: any) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(buffer);
//         }
//       });
//     });

//     // Save the PDF buffer to a file
//     const pdfFilePath = path.join(__dirname, `${uniqeId}.pdf`);
//     await fs.writeFile(pdfFilePath, pdfBuffer);

//     // Set the response headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${uniqeId}.pdf`);

//     // Trigger the download using res.download with the file path
//     res.download(pdfFilePath, `${uniqeId}.pdf`, (err) => {
//       if (err) {
//         // Handle any download errors here
//         console.error('Error during PDF download:', err);
//       } else {
//         // Delete the temporary PDF file after download
//         fs.unlink(pdfFilePath);
//       }
//     });

//     return commonUtils.sendSuccess(
//       req,
//       res,
//       { message: 'Bil created successfully!' },
//       200
//     );
//   } catch (err: any) {
//     console.error('Error creating Bil:', err);
//     return commonUtils.sendError(req, res, { message: err.message }, 409);
//   }
// };


const createBil = async (req: any, res: Response) => {
  try {
    console.log(req.body);

    const { userId, bil , millage } = req.body;
    console.log(req.body);
    
    const uniqeId: any = await getFacilityUniqId();
    const huntertip = new BIL({
      userId,
      Allitem: bil,
      billnumber: uniqeId,
      millage
    });
    await huntertip.save();

   
    return commonUtils.sendSuccess(
      req,
      res,
      { message: 'Bil created successfully!' },
      200
    );
  } catch (err: any) {
    console.error('Error creating Bil:', err);
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

async function pdfDownload(req: Request, res: Response) {
  try {
      const logo = config.get("LOGO_PATH_LOCAL") + config.get("LOGO_PATH");
      console.log(logo);
      
      const location_file = path.join(__dirname, '../pdf.ejs');
      const data = req.body;
      

      data.date_time = moment(data?.createdAt).format("DD MMM hh:mm:A");

      // Render the EJS template to HTML (replace this with your logic)
      const htmlContent = await ejs.renderFile(location_file, { data: data,logo:logo });

      // Set PDF options
      const options = {
          "height": "11.25in",
          "width": "8.5in",
          "header": {
              "height": "20mm"
          },
          "footer": {
              "height": "20mm",
          },
      };

      // Convert HTML to PDF
      pdf.create(htmlContent, options).toBuffer(async (err: any, pdfBuffer: any) => {
          if (err) {
              console.error("Error creating PDF:", err);
              return res.status(500).send({ message: "Failed to generate PDF." });
          }

          // Set headers
          res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
          res.setHeader("Content-Type", "application/pdf");

          // Set Content-Length header
          res.setHeader("Content-Length", pdfBuffer.length);

          // Send the PDF as response
          res.send(pdfBuffer);
      });
  } catch (err: any) {
      console.error("Error in pdfDownload:", err);
      return res.status(500).send({ message: "Internal Server Error." });
  }
}



const updateBil = async (req: any, res: Response) => {
  try {

    const id= req.query.id 

    const editbil = await BIL.findOne({_id:new mongoose.Types.ObjectId(id)})

    if (!editbil) {
      return commonUtils.sendError(req, res, { message: "Bil not found" }, 404);
    }

    
    const { bil , millage } =req.body;
    console.log(req.body);
    
    
    editbil.Allitem = bil,
    editbil.millage = millage,
    
    await editbil.save();
    return commonUtils.sendSuccess(
      req,
      res,
      { message: "Bil update successfully!" },
      200
    );
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

const changestatusHuntertip = async (req: any, res: Response) => {
  const { id } = req.query
  const { status } = req.body;
  try {
    const hunter = await HunterTip.findOne({ _id: id });

    if (!hunter) {
      return commonUtils.sendError(req, res, { message: AppStrings.HUNTER_NOT_FOUND }, 404);
    }

    let newStatus;

    switch (status) {
      case 0:
        newStatus = 1;
        break;
      case 1:
        newStatus = 0;
        break;
      default:
        return commonUtils.sendError(
          req,
          res,
          { message: AppStrings.INVALID_STATUS },
          400
        );
    }

    // Update the user's isApprove status
    hunter.status = newStatus;
    await hunter.save();

    return commonUtils.sendSuccess(req, res, hunter);
  } catch (error) {
    console.error("Error updating user approval status:", error);
    return commonUtils.sendError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 500);
  }
};

const UpdathunterTip = async (req: any, res: Response) => {
  const { id } = req?.query;

  const hunter = await HunterTip.findById(id);
  console.log(hunter);

  if (!hunter) return commonUtils.sendError(req, res, { message: AppStrings.HUNTERTIP_NOT_FOUND }, 409);
  try {
    const { title, description, image } = req.body;

    const Title = title || hunter.title;
    const Description = description || hunter.description;
    const Image = image || hunter.image;

    if (image) {
      if (hunter.image) {
        var filename = path?.basename(hunter?.image);
        if (fs.existsSync("uploads/admin/" + filename) && filename != "") {
          fs.unlinkSync("uploads/admin/" + filename);
        }
      }
    }

    hunter.image = Image;
    hunter.title = Title;
    hunter.description = Description;

    await hunter.save();
    return commonUtils.sendSuccess(req, res, { message: "Hunter Tip updated successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};
const getTutorial = async (req: any, res: Response) => {
  const user = await Item.find().sort({ createdAt: "desc" });
  return commonUtils.sendSuccess(req, res, user);
};

const CreateTutorial = async (req: any, res: Response) => {
  try {

    const { item, amount } =
      req.body;
    let items = await new Item({
      item,
      amount,
    });
    await items.save();
    return commonUtils.sendSuccess(
      req,
      res,
      { message: "Item created successfully!" },
      200
    );
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

async function changetutorialStatus(req: Request, res: Response) {
  try {
    const support = await Tutorial.findOne({ _id: req.params.id });
    support.status = support.status == 0 ? 1 : 0
    await support.save();
    return commonUtils.sendSuccess(req, res, { message: "status change successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}
async function updateTutorial(req: Request, res: Response) {
  try {
    const { item,amount } = req.body;
    const items = await Item.findOne({ _id: req.query.id });
    items.item = item;
    items.amount = amount;
    await items.save();
    return commonUtils.sendSuccess(req, res, { message: "Item update successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.params;

  let destination = "./uploads/admin";

  const image_ = multer({
    storage: commonFileStorage(destination),
    fileFilter: fileFilter,
  }).single("image");

  image_(req, res, async (err: any) => {
    if (err) return commonUtils.sendError(req, res, { message: err.message }, 409);
    if (!req.file) return commonUtils.sendError(req, res, { message: AppStrings.IMAGE_NOT_FOUND }, 409);
    const image_name = req.file.filename;

    return commonUtils.sendSuccess(req, res, {
      file_name: image_name,
    }, 200);
  });
}

const purchaseplan = async (req: any, res: Response) => {
  try {
    const purchase = await Subscription.find();
    return commonUtils.sendSuccess(req, res, purchase);
  } catch (error: any) {
    return commonUtils.sendError(req, res, { message: error.message }, 409);
  }
};
const userSubscription = async (req: any, res: Response) => {
  try {
    const { serach } = req.query;
    const usersubscription = await UserSubscription.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_data',
        },
      },
      {
        $unwind: {
          path: "$user_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscription_id',
          foreignField: '_id',
          as: 'subscription_data',
        },
      },
      {
        $unwind: {
          path: "$subscription_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $match: {
          $or: [
            { 'user_data.firstname': { $regex: serach, $options: 'i' } },
            { 'user_data.lastname': { $regex: serach, $options: 'i' } },
            { order_id: { $regex: serach, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          order_id: 1,
          coupon_id: 1,
          start_date: 1,
          end_date: 1,
          payment_status: 1,
          createdAt: 1,
          user_first: "$user_data.firstname",
          user_last: "$user_data.lastname",
          subscription_price: "$subscription_data.price",
          total_price: {
            $cond: {
              if: { $eq: ["$coupon_id", null] },
              then: "$subscription_data.price",
              else: {
                $subtract: [
                  "$subscription_data.price",
                  { $multiply: ["$subscription_data.price", { $divide: [10, 100] }] }
                ]
              }
            }
          },
          subscription_currency: "$subscription_data.currency"
        },
      },
    ]);
    return commonUtils.sendSuccess(req, res, usersubscription);
  } catch (error: any) {
    return commonUtils.sendError(req, res, { message: error.message }, 409);
  }
};

const userSubscriptionList = async (req: any, res: Response) => {
  try {
    const usersubscription = await User.aggregate([
      {
        $match: {
          is_subscription: 1
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
          image: 1,
          createdAt: 1
        },
      },
    ]);
    return commonUtils.sendSuccess(req, res, usersubscription);
  } catch (error: any) {
    return commonUtils.sendError(req, res, { message: error.message }, 409);
  }
};

async function getNotification(req: Request, res: Response) {
  try {
    const notifications = await Notification.find({ is_admin: true }).sort({ createdAt: -1 });

    return commonUtils.sendSuccess(req, res, notifications, 200);
  }
  catch (err: any) {
    console.log(err)
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

async function sendAlluserNotification(req: Request, res: Response) {
  try {
    const message = {
      notification: {
        title: req.body.title,
        body: req.body.message
      },
      data: {
        type: String(5)
      },
      topic: "general_notification",
    };

    await commoncontroller.sendAllUserNotification(message);
    return commonUtils.sendSuccess(req, res, {}, 200);

  }
  catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

const promoCode = async (req: any, res: Response) => {
  try {
    const promocode = await PromoCode.find().select(
      "_id promo_code status createdAt"
    ).sort({ createdAt: "desc" });
    return commonUtils.sendSuccess(req, res, promocode[0]);
  }
  catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

const changePromoCodeStatus = async (req: any, res: Response) => {
  const { id } = req.query
  try {
    const promocode = await PromoCode.findOne({ _id: id });

    if (!promocode) {
      return commonUtils.sendError(req, res, { message: AppStrings.PROMOCODE_NOT_FOUND }, 404);
    }

    let newStatus;

    switch (promocode?.status) {
      case true:
        newStatus = false;
        break;
      case false:
        newStatus = true;
        break;
      default:
        return commonUtils.sendError(
          req,
          res,
          { message: AppStrings.INVALID_STATUS },
          400
        );
    }

    // Update the user's isApprove status
    promocode.status = newStatus;
    await promocode.save();

    return commonUtils.sendSuccess(req, res, promocode);
  } catch (error) {
    console.error("Error updating user approval status:", error);
    return commonUtils.sendError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 500);
  }
};

const createtechniques = async (req: any, res: Response) => {
  try {

    const { title } =
      req.body;
    let techniques = await new Techniques({
      title
    });
    await techniques.save();
    return commonUtils.sendSuccess(
      req,
      res,
      { message: "Techniques created successfully!" },
      200
    );
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

const gettechniques = async (req: any, res: Response) => {
  try {
    const promocode = await Techniques.find().select(
      "_id title status createdAt"
    ).sort({ createdAt: "desc" });


    return commonUtils.sendSuccess(req, res, promocode);
  }
  catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};


const Updattechniques = async (req: any, res: Response) => {
  const { id } = req?.query;

  const techniques = await Techniques.findById(id);

  if (!techniques) return commonUtils.sendError(req, res, { message: AppStrings.TECHNIQUES_NOT_FOUND }, 409);
  try {
    const { title } = req.body;

    const Title = title || techniques.title;

    techniques.title = Title;

    await techniques.save();
    return commonUtils.sendSuccess(req, res, { message: "Techniques updated successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

const changestatustechniques = async (req: any, res: Response) => {
  const { id } = req.query
  const { status } = req.body;

  try {
    const techniques = await Techniques.findOne({ _id: id });

    if (!techniques) {
      return commonUtils.sendError(req, res, { message: AppStrings.TECHNIQUES_NOT_FOUND }, 404);
    }

    let newStatus;

    switch (status) {
      case 0:
        newStatus = 1;
        break;
      case 1:
        newStatus = 0;
        break;
      default:
        return commonUtils.sendError(
          req,
          res,
          { message: AppStrings.INVALID_STATUS },
          400
        );
    }

    // Update the user's isApprove status
    techniques.status = newStatus;
    await techniques.save();

    return commonUtils.sendSuccess(req, res, techniques);
  } catch (error) {
    return commonUtils.sendError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 500);
  }
};
const changeReportPostStatus = async (req: any, res: Response) => {
  try {

    const { post_id, type } = req.body;

    //1=accept 2=reject

    const reportpost = await reportPost.find({ post_id: new mongoose.Types.ObjectId(post_id) })

    if (type == 1) {
      reportpost.map(async (post: any) => {
        post.status = 1;
        await post.save()
      })

      const post = await Post.findOne({ _id: post_id })
      post.is_reported = 1;
      await post.save();

    } else {
      reportpost.map(async (post: any) => {
        post.status = 2;
        await post.save()
      })
    }

    return commonUtils.sendSuccess(req, res, {}, 200);
  }
  catch (error) {
    return commonUtils.sendError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 500);
  }
};

const changeReportUserStatus = async (req: any, res: Response) => {
  try {

    const { user_id, type } = req.body;

    //1=accept 2=reject

    const reportuser = await reportUser.find({ reported_user_id: new mongoose.Types.ObjectId(user_id) })

    if (type == 1) {
      reportuser.map(async (post: any) => {
        post.status = 1;
        await post.save()
      })

      const user = await User.findOne({ _id: user_id })
      user.is_reported = 1;
      await user.save();

    } else {

      reportuser.map(async (post: any) => {
        post.status = 2;
        await post.save()
      })
    }

    return commonUtils.sendSuccess(req, res, {}, 200);
  }
  catch (error) {
    return commonUtils.sendError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 500);
  }
};

const getpostreport = async (req: any, res: Response) => {
  try {
    const reportpost = await reportPost.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_name"
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "post_id",
          foreignField: "_id",
          as: "post_data"
        }
      },
      {
        $lookup: {
          from: "reportsubjects",
          localField: "report_subject_id",
          foreignField: "_id",
          as: "report_subject_data"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "post_user_id",
          foreignField: "_id",
          as: "report_post_user"
        }
      },
      { $unwind: { path: "$user_name", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$post_data", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$report_subject_data", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$report_post_user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          post_id: 1,
          status: 1,
          "user_name": { $concat: ["$user_name.firstname", " ", "$user_name.lastname"] },
          "report_post_user": { $concat: ["$report_post_user.firstname", " ", "$report_post_user.lastname"] },
          "post_image": "$post_data.image",
          "report_name": "$report_subject_data.name",
        }
      },
      {
        $group: {
          _id: "$post_id",
          reports: {
            $push: {
              user_name: "$user_name",
            },
          },
          firstReport: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$firstReport", { reports: "$reports" }],
          },
        },
      },
    ]);

    return commonUtils.sendSuccess(req, res, reportpost);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};

const getuserreport = async (req: any, res: Response) => {

  try {
    const reportpost = await reportUser.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_name",
        },
      },
      {
        $lookup: {
          from: "reportsubjects",
          localField: "report_subject_id",
          foreignField: "_id",
          as: "report_subject_data",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reported_user_id",
          foreignField: "_id",
          as: "reported_user",
        },
      },
      { $unwind: { path: "$user_name", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$report_subject_data", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$reported_user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          status: 1,
          reported_user_id: 1,
          user_id: 1,
          user_name: { $concat: ["$user_name.firstname", " ", "$user_name.lastname"] },
          "reported_user": { $concat: ["$reported_user.firstname", " ", "$reported_user.lastname"] },
          "report_subject": "$report_subject_data.name",
        },
      },
      {
        $group: {
          _id: "$reported_user_id",
          reports: {
            $push: {
              user_id: "$user_id",
              user_name: "$user_name",
            },
          },
          firstReport: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$firstReport", { reports: "$reports" }],
          },
        },
      },
    ]);

    return commonUtils.sendSuccess(req, res, reportpost);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
};


export default {
  register,
  login,
  // logout,
  // refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  dashboard,
  userList,
  allUserList,
  brokerList,
  changeUserStatus,
  carrierSubUserList,
  WorkList,
  CreateWork,
  Updatework,
  Deletework,
  bilList,
  createBil,
  updateBil,
  changestatusHuntertip,
  UpdathunterTip,
  getSharedPostList,
  getSavedPostList,
  getTutorial,
  CreateTutorial,
  updateTutorial,
  changetutorialStatus,
  uploadImage,
  purchaseplan,
  userSubscription,
  userSubscriptionList,
  getNotification,
  sendAlluserNotification,
  promoCode,
  changePromoCodeStatus,
  createtechniques,
  gettechniques,
  Updattechniques,
  changestatustechniques,
  getpostreport,
  getuserreport,
  changeReportPostStatus,
  changeReportUserStatus,
  pdfDownload
};
