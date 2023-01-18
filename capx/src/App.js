import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State to store the collection of objects
  const [objects, setObjects] = useState([]);
  // State to store the total number of object
  const [numberObjects, setNumberObjects] = useState(0);
  // State to store opacity status of objects (transpant objects are false)
  const [selectedType, setSelectedType] = useState({
    triangle: true,
    square: true,
    circle: true,
  });
  // State to store the animation status (stopped, forward, backward)
  const [animationStatus, setAnimationStatus] = useState("stopped");

  // Run the animation when animation status is not "stopped"
  useEffect(() => {
    if (animationStatus === "stopped") return;
    let animationId = setInterval(() => {
      setObjects((prevObjects) => {
        let newObjects = prevObjects.map((object) => {
          let newX =
            object.position.x +
            (animationStatus === "forward"
              ? object.velocity.dx
              : -object.velocity.dx);
          let newY =
            object.position.y +
            (animationStatus === "forward"
              ? object.velocity.dy
              : -object.velocity.dy);
          // map over the objects, updating their position based on dx and dy
          return {
            ...object,
            position: { x: newX, y: newY },
          };
        });
        return newObjects;
      });
    }, 1000);

    // cleanup function to stop the animation when the component unmounts or the animation status changes
    return () => clearInterval(animationId);
  }, [animationStatus]);

  // function to store total number object in state
  const handleNumberChange = (e) => {
    e.preventDefault();
    setNumberObjects(e.target.value);
  };

  // function to generate array of objects with random values
  const generateObjects = () => {
    let newObjects = [];
    for (let i = 0; i < numberObjects; i++) {
      let object = {
        name: `Obj-${i + 1}`,
        type: ["triangle", "square", "circle"][Math.floor(Math.random() * 3)],
        color: Math.floor(Math.random() * 16777215).toString(16),
        size: Math.floor(Math.random() * 10 + 5),
        position: {
          x: Math.floor(Math.random() * 800),
          y: Math.floor(Math.random() * 800),
        },
        velocity: {
          dx: (Math.random() - 0.5) * 10,
          dy: (Math.random() - 0.5) * 10,
        },
      };
      newObjects.push(object);
    }
    setObjects(newObjects);
    setSelectedType({
      triangle: true,
      square: true,
      circle: true,
    });
    console.log(newObjects);
  };

  // function to return CSS style of object (color, shape, size, transparency )
  const objectStyle = (obj) => {
    let styles = {
      width: obj.size + "px",
      height: obj.size + "px",
      background: `${
        obj.color.length < 6 ? "#0" + obj.color : "#" + obj.color
      }`,
      position: "absolute",
      left: obj.position.x * (600 / 800) + "px",
      top: obj.position.y * (600 / 800) + "px",
    };
    if (obj.type === "circle") {
      styles = {
        ...styles,
        borderRadius: "50%",
      };
    }
    if (obj.type === "triangle") {
      styles["width"] = 0;
      styles["height"] = 0;
      delete styles["background"];
      styles = {
        ...styles,
        borderLeft: `${obj.size / 2}px solid transparent`,
        borderRight: `${obj.size / 2}px solid transparent`,
        borderBottom: `${obj.size}px solid ${
          obj.color.length < 6 ? "#0" + obj.color : "#" + obj.color
        }`,
      };
    }
    if (!selectedType[obj.type]) {
      styles = {
        ...styles,
        opacity: 0.5,
      };
    }

    return styles;
  };

  return (
    <div>
      <div className="borderedRegion">
        {/* Render the objects */}
        {objects.map((object) => (
          <div
            key={object.name}
            className={"object"}
            style={objectStyle(object)}
          >
            <p className="objactName">{object.name}</p>
          </div>
        ))}
      </div>
      {/* Input total number of objects*/}
      <div>
        <label style={{ margin: "30px 10px" }}>
          Please enter number of objects:
        </label>
        <input
          data-testid="number-input"
          style={{ margin: "30px 10px" }}
          type="number"
          onChange={handleNumberChange}
        />
        <button style={{ margin: "30px 10px" }} onClick={generateObjects}>
          Generate Objects
        </button>
      </div>
      {/* Checkbox for changing opacity*/}
      <div style={{ margin: "10px" }}>
        <input
          type="checkbox"
          id="triangleCheckBox"
          onChange={() =>
            setSelectedType({
              ...selectedType,
              triangle: !selectedType.triangle,
            })
          }
          checked={selectedType.triangle}
        />
        <label for="triangleCheckBox">Triangle</label>
        <br />
        <input
          type="checkbox"
          id="squareCheckBox"
          onChange={() =>
            setSelectedType({ ...selectedType, square: !selectedType.square })
          }
          checked={selectedType.square}
        />
        <label for="squareCheckBox">Squares</label>
        <br />
        <input
          type="checkbox"
          id="circleCheckBox"
          onChange={() =>
            setSelectedType({ ...selectedType, circle: !selectedType.circle })
          }
          checked={selectedType.circle}
        />
        <label for="circleCheckBox">Circles</label>
      </div>
      {/* Forward and Backward button for changing position based on object velocity*/}
      <div>
        <button
          id="backwardButton"
          onClick={() =>
            setAnimationStatus(
              animationStatus === "stopped" ? "backward" : "stopped"
            )
          }
          style={{
            margin: "30px 10px",
            backgroundColor: animationStatus === "backward" ? "darkgray" : "",
          }}
        >
          Backward
        </button>
        <button
          id="forwardButton"
          onClick={() =>
            setAnimationStatus(
              animationStatus === "stopped" ? "forward" : "stopped"
            )
          }
          style={{
            margin: "30px 10px",
            backgroundColor: animationStatus === "forward" ? "darkgray" : "",
          }}
        >
          Forward
        </button>
      </div>
    </div>
  );
}

export default App;
