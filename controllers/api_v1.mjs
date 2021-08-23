import client from '../db/client.mjs';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';

const getLocations = async (req, res) => {
  const db = client.db('main').collection('tourLocations');
  const cursor = await db.find({});
  const locations = await cursor.toArray();
  await cursor.close();
  
  res.status(200).json(locations);
};

const getAgencyReviews = async (req, res) => {
  const db = client.db('main').collection('agencyReviews');
  const cursor = await db.find().limit(3);
  const reviews = await cursor.toArray();
  await cursor.close();

  res.status(200).json(reviews);
};

const getPopTours = async (req, res) => {
  const db = client.db('main').collection('popToursPreviews');
  const cursor = await db.find().limit(3);
  const popularTours = await cursor.toArray();
  await cursor.close();
  
  res.status(200).json(popularTours);
};

const getAllTours = async (req, res) => {
  let { skip = 0, minPrice = 0, maxPrice = 999999, scores = [1, 2, 3, 4, 5], country = '' } = req.query;
  scores = Array.from(scores).map(score => parseInt(score, 10));
  if (country.length !== 0) country = country.split(',');

  let pipeline = [];
  let countPipeline = [];
  if (country.length > 0) {
    pipeline = [
      {
        $project: {
          floorScore: {$floor: "$score"}, title: 1, country: 1, city: 1, score: 1, fromPrice: 1, imgURL: 1, fullDetails: 1
        }
      },
      {
        $match: {
          fromPrice: { 
            $gte: parseInt(minPrice, 10), $lte: parseInt(maxPrice, 10) 
          },
          country: {
            $in: country
          },
          floorScore: {$in: scores}
        }
      },
      {
        $skip: parseInt(skip, 10)
      },
      {
        $limit: 6
      },
      {
        $project: {
          floorScore: 0
        }
      }
    ];
    countPipeline = [
      {
        $project: {
          floorScore: {$floor: "$score"}, title: 1, country: 1, city: 1, score: 1, fromPrice: 1, imgURL: 1, fullDetails: 1
        }
      },
      {
        $match: {
          fromPrice: { 
            $gte: parseInt(minPrice, 10), $lte: parseInt(maxPrice, 10) 
          },
          country: {
            $in: country
          },
          floorScore: {$in: scores}
        }
      },
      {
        $group: { _id: null, count: { $sum: 1 } }
      }
    ]
  } else {
    pipeline = [
      {
        $project: {
          floorScore: {$floor: "$score"}, title: 1, country: 1, city: 1, score: 1, fromPrice: 1, imgURL: 1, fullDetails: 1
        }
      },
      {
        $match: {
          fromPrice: { 
            $gte: parseInt(minPrice, 10), $lte: parseInt(maxPrice, 10) 
          },
          floorScore: {$in: scores}
        }
      },
      {
        $skip: parseInt(skip, 10)
      },
      {
        $limit: 6
      },
      {
        $project: {
          floorScore: 0
        }
      }
    ];
    countPipeline = [
      {
        $project: {
          floorScore: {$floor: "$score"}, title: 1, country: 1, city: 1, score: 1, fromPrice: 1, imgURL: 1, fullDetails: 1
        }
      },
      {
        $match: {
          fromPrice: { 
            $gte: parseInt(minPrice, 10), $lte: parseInt(maxPrice, 10) 
          }, 
          floorScore: {$in: scores}
        }
      },
      {
        $group: { _id: null, count: { $sum: 1 } }
      }
    ]
  }

  const db = client.db('main').collection('allToursPreviews');
  const cursor = await db.aggregate(pipeline);
  const tours = await cursor.toArray();

  const countCursor = await db.aggregate(countPipeline);
  const countArray = await countCursor.toArray();
  const documentsCount = countArray[0]?.count ?? 0;

  const retrievedDocs = tours.length;

  await cursor.close();
  await countCursor.close();

  res.status(200).json({ docs: tours, documentsCount, retrievedDocs });
};

const getTour = async (req, res) => {
  const { tourId } = req.params;
  const db = client.db('main').collection('allTours');
  const tour = await db.findOne({ _id: ObjectId(tourId) }, { projection: { _id: 0 } });

  if (tour) res.status(200).json({ ...tour, isFound: true })
  else res.status(400).json({ isFound: false });
};

const bookTour = async (req, res) => {
  const { fullName, phone, email, plan } = req.body;
  const collection = client.db('main').collection('bookedTours');
  try {
    await collection.insertOne({ fullName, phone, email, plan });

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER_USER,
        pass: process.env.EMAIL_SENDER_PASS
      },
    });
    await transporter.sendMail({
      from: '"Traveler" <traveler.travelagency@gmail.com>',
      to: email,
      subject: `Hello, ${fullName}! Your tour has been booked.`,
      text: "Placeholder Text",
      html: "<b>Placeholder Text</b>"
    });
    
    res.status(200).json({ isBooked: true });
  } catch(err) {
    res.status(400).json({ isBooked: false });
  }
}

export { getLocations, getAgencyReviews, getPopTours, getAllTours, getTour, bookTour };