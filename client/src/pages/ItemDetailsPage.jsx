import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { Button, Card } from "flowbite-react";
import { throttle } from "lodash";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    productName: "",
    brandName: "",
    category: "",
    imageUrls: [],
    description: "",
    price: "",
    sellingPrice: "",
    status: "",
    claimantName: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // const [zoomImage, setZoomImage] = useState(false);
  // const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setActiveImageIndex(0);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  // const handleImageZoom = (e) => {
  //   const { left, top, width, height } = e.target.getBoundingClientRect();
  //   const x = ((e.clientX - left) / width) * 100;
  //   const y = ((e.clientY - top) / height) * 100;
  //   setZoomCoords({ x, y });
  //   setZoomImage(true);
  // };

  // const handleImageLeave = () => setZoomImage(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Card>
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        <div className="flex-1">
          <div className="relative">
            <img
              src={item.imageUrls[activeImageIndex]}
              alt="Main Product"
              className="w-full object-contain h-[40rem]"
              // onMouseMove={handleImageZoom}
              // onMouseLeave={handleImageLeave}
            />
            {/* {zoomImage && (
              <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url(${item.imageUrls[activeImageIndex]})`,
                  backgroundPosition: `${zoomCoords.x}% ${zoomCoords.y}%`,
                }}
              ></div>
            )} */}
          </div>
          <div className="flex overflow-auto gap-2 mt-2 justify-center">
            {item.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index}`}
                className={`cursor-pointer w-20 h-20 object-cover ${
                  index === activeImageIndex ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{item.item}</h1>
          <p className="text-sm mt-5">{item.brandName}</p>
          <p className="text-lg font-semibold mb-5">{item.location}</p>
          <p>{item.description}</p>
          <Button className="mt-10" onClick={() => navigate("/verify")}>
            Claim
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ItemDetail;
