const contentModel = require("../models/Content");
const contentDetailsModel = require("../models/ContentDetails");
const { ErrorHandler } = require("../utils/error");
const { generateCode } = require("../helpers/code_generator");
const XLSX = require("xlsx");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports.uploadContent = async (req, res, next) => {
  const { user, file } = req;
  try {
    const dt = XLSX.readFile("public/uploads/" + file.filename);
    console.log("file read done", dt)
    const first_worksheet = dt.Sheets[dt.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

    const content = await contentModel.create({
      code: generateCode(),
      file_name: file.originalname,
      created_by: user.id,
    });

    for (let i = 1; i < data.length; i++) {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: data[i][1],
        max_tokens: 1000,
        n: 1,
      });
      console.log("content generate complete for ", data[i][1])
      const completion = response.data.choices[0].text;

      await contentDetailsModel.create({
        content: content._id,
        topic: data[i][0],
        prompt: data[i][1],
        article: completion,
      });
    }
    console.log("content generate done..")
    const path = `public/uploads/${file.filename}`;
    // delete file
    if (fs.existsSync(path)) {
      setTimeout(() => {
        fs.rmSync(path, { recursive: true, force: true });
      }, 60000);
    }

    res.send({
      status: true,
      data: data,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.downloadContent = async (req, res, next) => {
  const { user, body } = req;
  // console.log("request body is ", body)
  try {
    const contents = await contentDetailsModel
      .find({ content: body.content })
      .populate({ path: "content", select: "file_name -_id" })
      .sort({ createdAt: "desc" });
  //  console.log("content is ", contents)
    const data = [];
    contents.map((item) =>
      data.push({
        topic: item.topic,
        ai_prompt: item.prompt,
        article: item.article,
      })
    );

    // console.log("data is ", data)

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    const path = `public/download/${contents[0].content.file_name}`;
    XLSX.writeFile(wb, path);

    // delete file
    if (fs.existsSync(path)) {
      setTimeout(() => {
        fs.rmSync(path, { recursive: true, force: true });
      }, 60000);
    }

    res.send({
      status: true,
      data: path,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.getContents = async (req, res, next) => {
  try {
    const { query } = req;
    const { page, limit } = query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    if (page) delete query.page;
    if (limit) delete query.limit;
    if (query.name) {
      query.name = { $regex: query.name, $options: "i" };
    }
    const contents = await contentModel
      .find({ ...req.query })
      .populate({ path: "created_by", select: "name -_id" })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    res.send({
      status: true,
      data: contents,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.getContentById = async (req, res, next) => {
  try {
    const content = await contentModel
      .findOne({ _id: req.params.id })
      .populate({ path: "created_by", select: "name -_id" });

    if (!content) {
      throw new ErrorHandler("Content not found.", 404);
    }

    res.send({
      status: true,
      data: content,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.updateContentById = async (req, res, next) => {
  const { body, user, params } = req;
  if (body.content_id) delete body.content_id;
  if (body.created_by) delete body.created_by;
  try {
    const content = await contentModel
      .findOneAndUpdate(
        { _id: params.id },
        { ...body, updated_by: user.id },
        { new: true }
      )
      .populate({ path: "created_by", select: "name -_id" });
    if (!content) {
      throw new ErrorHandler("Content update failed.", 404);
    }
    res.send({
      status: true,
      data: content,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.deleteContentById = async (req, res, next) => {
  try {
    await contentModel.findOneAndDelete({ _id: req.params.id });

    res.send({
      status: true,
      message: "Content deleted successfully.",
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};