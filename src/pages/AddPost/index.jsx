import React, { useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector} from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRef } from 'react';
import { instance } from './../../axios';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export const AddPost = () => {

  const { id } = useParams();
  
  const navigate = useNavigate();

  const isAuth = useSelector(selectIsAuth)

  const [isLoading, setLoading] = useState('false');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await instance.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
   };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        imageUrl,
        tags,
        text,
      }; 
      setLoading(true)
      const { data } = isEditing 
      ? await instance.patch(`/posts/${id}`, fields)
      : await instance.post('/posts', fields);

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    if (id) {
      instance.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title)
        setText(data.text)
        setTags(data.tags.join(','))
        setImageUrl(data.imageUrl)
      })
    }
  },[id])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {

        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" /></>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)} />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">{isEditing ? 'Save' : 'Опубликовать' }
          
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
