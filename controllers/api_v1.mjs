import nodemailer from "nodemailer";
import validateInputs from "./validateInputs.mjs";
import fs from "fs";

const locationsRawdata = fs.readFileSync("./db/locations.json");
const locations = JSON.parse(locationsRawdata);

const agencyReviewsRawdata = fs.readFileSync("./db/agency_reviews.json");
const agencyReviews = JSON.parse(agencyReviewsRawdata);

const popToursRawdata = fs.readFileSync("./db/pop_tours.json");
const popularTours = JSON.parse(popToursRawdata);

const allToursRawdata = fs.readFileSync("./db/all_tours.json");
const allTours = JSON.parse(allToursRawdata);

const allToursPrevsRawdata = fs.readFileSync("./db/all_tours_prevs.json");
const allToursPrevs = JSON.parse(allToursPrevsRawdata);

const getLocations = async (req, res) => {
  const locs = locations;

  res.status(200).json(locs);
};

const getAgencyReviews = async (req, res) => {
  const reviews = agencyReviews;

  res.status(200).json(reviews);
};

const getPopTours = async (req, res) => {
  const tours = popularTours;

  res.status(200).json(tours);
};

const getAllTours = async (req, res) => {
  let {
    skip = 0,
    minPrice = 0,
    maxPrice = 999999,
    scores = [1, 2, 3, 4, 5],
    country = "",
  } = req.query;
  scores = Array.from(scores).map((score) => parseInt(score, 10));
  if (country.length !== 0) country = country.split(",");

  const prevs = allToursPrevs;
  let matched;
  let matchedCount;

  if (country.length > 0) {
    matched = prevs.filter((el) => {
      return (
        el.fromPrice >= parseInt(minPrice, 10) &&
        el.fromPrice <= parseInt(maxPrice, 10) &&
        country.includes(el.country) &&
        scores.includes(el.floorScore)
      );
    });
  } else {
    matched = prevs.filter((el) => {
      return (
        el.fromPrice >= parseInt(minPrice, 10) &&
        el.fromPrice <= parseInt(maxPrice, 10) &&
        scores.includes(el.floorScore)
      );
    });
  }
  matched = matched.slice(parseInt(skip, 10));
  matched = matched.slice(0, 6);

  matchedCount = matched.length;

  const docsCount = prevs.length;

  res.status(200).json({
    docs: matched,
    documentsCount: docsCount,
    retrievedDocs: matchedCount,
  });
};

const getTour = async (req, res) => {
  const { tourId } = req.params;
  const tours = allTours;
  const tour = tours.find((tour) => tour.id === Number(tourId));

  if (tour) res.status(200).json({ ...tour, isFound: true });
  else res.status(400).json({ isFound: false });
};

const bookTour = async (req, res) => {
  const { fullName, phone, email, plan } = req.body;

  if (
    Object.values(validateInputs(fullName, phone, email)).every((val) => val)
  ) {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_SENDER_USER,
          pass: process.env.EMAIL_SENDER_PASS,
        },
      });
      await transporter.sendMail({
        from: '"Traveler" <traveler.travelagency@gmail.com>',
        to: email,
        subject: `Hello, ${fullName}! Your tour has been booked.`,
        text: "Placeholder Text",
        html: "<b>Placeholder Text</b>",
      });

      res.status(200).json({ isBooked: true });
    } catch (err) {
      res.status(400).json({ isBooked: false });
    }
  } else {
    res.status(400).json({ isBooked: false });
  }
};

export {
  getLocations,
  getAgencyReviews,
  getPopTours,
  getAllTours,
  getTour,
  bookTour,
};
