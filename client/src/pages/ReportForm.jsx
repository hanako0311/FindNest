import React, { useState } from 'react';
import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // This imports the default stylesheet for the editor
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CreateLostFoundPost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    item: '',
    dateFound: '',
    location: '',
    description: '',
    image: ''
  });

  const handleUploadImage = async (e) => {
    // Here you would handle the image upload logic
    // Since you mentioned this is a MERN app, you will eventually handle the upload to your server
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Report Found Item</h1>
      <form className='flex flex-col gap-4'>
        <TextInput
          type='text'
          placeholder='Item Found'
          required
          name='item'
          onChange={handleChange}
        />
        <TextInput
          type='date'
          placeholder='Date Found'
          required
          name='dateFound'
          onChange={handleChange}
        />
        <TextInput
          type='text'
          placeholder='Location Found'
          required
          name='location'
          onChange={handleChange}
        />
        <ReactQuill
          theme='snow'
          placeholder='Describe the item...'
          required
          onChange={(value) => {
            setFormData(prev => ({ ...prev, description: value }));
          }}
        />
        <div className='flex gap-4 items-center'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
            color="failure">
            Upload Image
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='Uploaded'
            className='w-full h-72 object-cover'
          />
        )}
        <Button type='button' gradientDuoTone='pinkToOrange'>
          Submit Found Item
        </Button>
      </form>
    </div>
  );
}
