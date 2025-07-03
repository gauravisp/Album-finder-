
import './App.css';
import { FormControl, InputGroup, Container, Button, Card, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const authString = btoa(`${clientId}:${clientSecret}`);

    const authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authString,
      },
      body: 'grant_type=client_credentials',
    };

    fetch('https://accounts.spotify.com/api/token', authParams)
      .then(result => result.json())
      .then(data => {
        setAccessToken(data.access_token);
      })
      .catch(error => console.error("Error fetching token:", error));
  }, []);

  async function search() {
    const artistParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      },
    };

    const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParams)
      .then(result => result.json())
      .then(data => {
        if (!data.artists || !data.artists.items || data.artists.items.length === 0) {
          alert("No artist found. Please try a different name.");
          return null;
        }
        return data.artists.items[0].id;
      });

    if (!artistID) return;

    await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=10`, artistParams)
      .then(result => result.json())
      .then(data => {
        setAlbums(data.items);
      });
  }

  return (
    <>
      <Container style={{ marginBottom: '30px' }}>
        {/* Glowing Logo */}
        <img
  src="/download (2).gif"
  alt="Logo"
  style={{
    height: "90px",
    marginBottom: "20px",
    borderRadius: "50%",
    boxShadow: "0 0 20px #ff6ec7, 0 0 40px #ff6ec733", // pink glow
    transition: "all 0.3s ease",
  }}
/>

<h1 style={{
  color: '#ff6ec7',
  fontSize: '2.4rem',
  fontWeight: '600',
  marginBottom: '25px',
  textShadow: '0 0 8px rgba(231, 45, 194, 0.67)', // fixed pink glow
}}>
  Album Finder 🎧
</h1>

        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type='input'
            aria-label="Search for an Artist"
            onKeyDown={event => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
            style={{
              width: '300px',
              height: '35px',
              borderWidth: '0px',
              borderStyle: 'solid',
              borderRadius: '5px',
              marginRight: '10px',
              paddingLeft: '10px'
            }}
          />

          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>

      {/* Lofi Music Visualizer */}
      <div className="lofi-bars">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Album Cards */}
      <Container>
        <Row style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignContent: 'center',
        }}>
          {albums.map((album) => (
            <Card key={album.id} style={{
              backgroundColor: 'white',
              margin: '10px',
              borderRadius: '5px',
              marginBottom: '30px',
              maxWidth: '250px',
            }}>
              <Card.Img
                width={200}
                src={album.images[0].url}
                style={{ borderRadius: '4%' }}
              />
              <Card.Body>
                <Card.Title style={{
                  whiteSpace: 'wrap',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginTop: '10px',
                  color: 'black'
                }}>{album.name}</Card.Title>
                <Card.Text style={{ color: 'black' }}>
                  Release Date: <br />{album.release_date}
                </Card.Text>
                {/* Spotify Embed */}
                <iframe
                  src={`https://open.spotify.com/embed/album/${album.id}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                  title="Spotify Embed"
                  style={{ borderRadius: '8px', marginTop: '10px' }}
                ></iframe>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default App;
