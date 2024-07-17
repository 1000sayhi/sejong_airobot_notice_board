import axios from "axios";


export const fetchNoticeData = async () => {
  const cheerio = require("cheerio");
  try {
    const response = await axios.get('bbs/notice');
    const $ = cheerio.load(response.data);
    const $trs = $("#list_board > ul:nth-child(3) > li");
    let dataArr = [];
    $trs.each((idx, ele) => {
      let title = $(ele).find(".col_subject a > span").text()

      if (title === "") {
        return;
      }
      dataArr.push({
        title: title,
      });
    });
    return dataArr;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const fetchSchoolNoticeData = async () => {
  const cheerio = require("cheerio");
  try {
    const response = await axios.get('schoolnoticeapi/boardlist.do?bbsConfigFK=333');
    const $ = cheerio.load(response.data);
    const $trs = $("body > div > table > tbody > tr");
    let dataArr = [];

    $trs.each((idx, ele) => {
      let title = $(ele).find(".subject > a").text()

      if (title === "") {
        return;
      }
      dataArr.push({
        title: title,
      });
    });
    return dataArr;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const fetchDoDreamNoticeData = async () => {
  const cheerio = require("cheerio");
  try {
    const response = await axios.get('dodreamapi');
    
    const $ = cheerio.load(response.data);
    const $trs = $("body > div:nth-child(2) > main > div.container > div:nth-child(4) > div > div.box.slick-initialized.slick-slider.slick-dotted > div > div");
    let dataArr = [];

    $trs.each((idx, ele) => {
      let title = $(ele).find("div.OPEN > a > .content > .title_wrap > b").text()

      if (title === "") {
        return;
      }
      dataArr.push({
        title: title,
      });
    });
    return dataArr;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const fetchLabInfo = async () => {
  const cheerio = require("cheerio");
  try {
    const response = await axios.get('myboard/p1');
    
    const $ = cheerio.load(response.data);
    const $trs = $("body > div.viewport > div.container > div.width_wrap > div > div > ul > li");
    let dataArr = [];

    $trs.each((idx, ele) => {
      const profName = $(ele).find("b").text()
      let labName = $(ele).find("div >  p:nth-child(6) > a").text()
      let labURL = $(ele).find("div >  p:nth-child(6) > a").attr("href")
      
      if (!labName) {
        labName = $(ele).find("div > p:nth-child(6)").text();
        if (labName.includes("연구실 :")) {
          labName = labName.replace("연구실 :", "").trim();
        }
        labURL = "";
      }

      dataArr.push({
        profName: profName,
        labName: labName,
        labURL: labURL,
      });
    });
    return dataArr;
  } catch (error) {
    console.log(error);
    return [];
  }
}
