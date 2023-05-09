import './App.css';
import Allimages from './data';
import React, { useState, useEffect } from 'react';
import SortableList, { SortableKnob } from 'react-easy-sort';
import { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

function App() {
  const [tag, setTag] = useState('All');
  const [oringinImages, setoringinImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [image, setimage] = useState('');
  const [addimageName, setaddimageName] = useState();
  const [addimagestag, setaddimagetag] = useState();

  const handleChange = (e) => {
    setTag(e.target.value);
  };

  const openmodal = (e) => {
    setimage(e.target.src);
    const infoModal = document.getElementById('infoModal');
    infoModal.showModal();
  };

  const openmodal2 = (e) => {
    const infoModal = document.getElementById('infoModal2');
    infoModal.showModal();
  };

  const handleclose = (e) => {
    const infoModal = document.getElementById('infoModal');
    const dialogDimensions = infoModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      infoModal.close();
    }
  };
  const canceldialog = () => {
    const infoModal2 = document.getElementById('infoModal2');
    infoModal2.close();
  };

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setaddimageName(reader.result);
    };
  };

  const submitHandler = () => {
    const newarray = {
      id: Math.random(),
      imageName: addimageName,
      tag: addimagestag,
    };
    const copy = [...filteredImages];
    copy.push(newarray);
    setFilteredImages(copy);
    localStorage.setItem('save', JSON.stringify(copy));
  };

  const remove = () => {
    localStorage.clear();
    setFilteredImages([]);
  };

  useEffect(() => {
    const saveitem = JSON.parse(localStorage.getItem('save')) || [];
    tag === 'All'
      ? setoringinImages(Allimages)
      : setoringinImages(Allimages.filter((image) => image.tag === tag));

    tag === 'All'
      ? setFilteredImages(saveitem)
      : setFilteredImages(saveitem.filter((image) => image.tag === tag));
  }, [tag]);

  useEffect(() => {
    setFilteredImages([]);
    const saveitem = JSON.parse(localStorage.getItem('save')) || [];
    setoringinImages(Allimages);
    setFilteredImages(saveitem);
  }, []);

  //Drag
  const onSortEnd = (oldIndex, newIndex) => {
    setoringinImages((array) => arrayMove(array, oldIndex, newIndex));
    setFilteredImages((array) => arrayMove(array, oldIndex, newIndex));
  };

  return (
    <div className="App">
      <div className="tags">
        <label style={{ color: 'white', margin: 'auto 30px' }}>
          標籤:{' '}
          <select onChange={handleChange} name="selected">
            <option value="All">All</option>
            <option value="Tree">Tree</option>
            <option value="People">People</option>
            <option value="Dog">Dog</option>
          </select>
        </label>{' '}
        <button onClick={openmodal2}>加入圖片</button>{' '}
        <button onClick={remove}>刪除全部加入的圖片</button>
      </div>

      <div className="container">
        <h1>範例圖片</h1>
        <SortableList
          onSortEnd={onSortEnd}
          className="list"
          draggedItemClassName="dragged"
        >
          {oringinImages.map((image) => (
            <SortableItem key={image.id} className="image-card">
              <div className="item">
                <SortableKnob>
                  <div
                    style={{
                      position: 'absolute',
                      textAlign: 'center',
                      backgroundColor: 'gray',
                      borderRadius: '10px',
                      color: 'white',
                    }}
                  >
                    Drag me
                  </div>
                </SortableKnob>
                <img
                  onClick={openmodal}
                  className="image"
                  src={`/images/${image.imageName}`}
                  alt=""
                />{' '}
              </div>
            </SortableItem>
          ))}
        </SortableList>
        <br />
        <h1>加入的圖片</h1>
        <SortableList
          onSortEnd={onSortEnd}
          className="list"
          draggedItemClassName="dragged"
        >
          {filteredImages.map((image) => (
            <SortableItem key={image.id} className="image-card">
              <div className="item">
                <SortableKnob>
                  <div
                    style={{
                      position: 'absolute',
                      textAlign: 'center',
                      backgroundColor: 'gray',
                      borderRadius: '10px',
                      color: 'white',
                    }}
                  >
                    Drag me
                  </div>
                </SortableKnob>
                <img
                  onClick={openmodal}
                  className="image"
                  src={image.imageName}
                  alt=""
                />
              </div>
            </SortableItem>
          ))}
        </SortableList>
      </div>
      <dialog id="infoModal" onClick={handleclose}>
        <img
          width="600"
          style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
          src={image}
          alt=""
        />{' '}
      </dialog>

      <dialog id="infoModal2" onClick={handleclose}>
        <form>
          <p>
            <label className="label">
              圖片:{' '}
              <input
                accept="image/*"
                type="file"
                onChange={convertToBase64}
                required
              />
            </label>
          </p>
          <p>
            <label className="label">
              標籤:{' '}
              <select
                onChange={(e) => setaddimagetag(e.target.value)}
                name="selected"
              >
                <option value="select">請選擇</option>
                <option value="Tree">Tree</option>
                <option value="People">People</option>
                <option value="Dog">Dog</option>
              </select>
            </label>{' '}
          </p>
          <div>
            <button
              id="confirmBtn"
              type="comfirm"
              onClick={submitHandler}
              disabled={
                !addimageName || !addimagestag || addimagestag === 'select'
              }
            >
              確定
            </button>
            <button type="button" value="cancel" onClick={canceldialog}>
              取消
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

export default App;
