const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = async (req, res) => {
  const [albums] = await db.query("SELECT * FROM albums");
  res.status(200).json(albums);
};

const getOne = async (req, res) => {
  const [album] = await db.query("SELECT * FROM albums WHERE id = ?", [req.params.id]);
  
  if (!album[0]) {
    return res.status(404).send(`Album not found ${req.params.id}`)
  }

  res.status(200).json(album[0]);
};

const getTracksByAlbumId = (req, res) => {
  res.status(200).send('Get Albums route is OK');
};

const postAlbums = async (req, res) => {
  const [newAlbum] = await db.query("INSERT INTO albums (title, genre, picture, artist) VALUES (?, ?, ?, ?)", Object.values(req.body))
  
  console.log(newAlbum)
  res.status(201).json({
    id: newAlbum.insertId, 
    title: req.body.title, 
    genre: req.body.genre,
    picture: req.body.picture, 
    artist: req.body.artist,
  });
};

const updateAlbums = (req, res) => {
  const {id} = req.params;
  const objectKeys = Object.keys(req.body);
  const objectValues = [];
  const sql1 = "UPDATE albums SET ";
  let sql2 = "";
  const sql3 = " WHERE id = ?";

  const columns = {
    "id": "id",
    "title": "title",
    "genre": "genre",
    "picture": "picture",
    "artist": "artist"
  };

  objectKeys.forEach((key) => {
    if(columns[key]) {
      sql2 += `${columns[key]} = ?,`
      objectValues.push(req.body[key])
    }
  })

  sql2 = sql2.substring(0, sql2.length - 1)
  objectValues.push(id);
  
  db.query( `${sql1} ${sql2} ${sql3}`, objectValues)
  .then(([updatedAlbum]) => {
      return res.status(204).json({});
    })
    .catch((error) => {
      console.error(error)
    })
};

const deleteAlbums = (req, res) => {
  const {id} = req.params;
  const sqlQuery = "DELETE FROM albums WHERE id = ?";

  db.query(sqlQuery, [id])
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Bad luck');
    })
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};