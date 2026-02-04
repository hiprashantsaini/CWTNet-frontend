import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { assets } from "../../assets/assets";
import { appContext } from '../../context/appContext';
import './home.css';

function Home() {
	const {
		onSent,
		recentPrompt,
		showResults,
		loading,
		resultData,
		setInput,
		input,
	} = useContext(appContext);

	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
	const [selectedImage, setSelectedImage] = useState(null);
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const navigate=useNavigate();

	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedImage(URL.createObjectURL(file)); // Preview the image
		}
	};

	const gotoProfile=()=>{
        navigate(`/profile/${authUser.username}`);
	}

	return (
		<div className={`main ${theme}`}>
			<div className='nav'>
				<p>AI Guru</p>
				<img onClick={gotoProfile} src={authUser?.profilePicture} alt='' className='cursor-pointer'/>
			</div>
			<div className='main-container'>
				{!showResults ? (
					<>
						<div className='greet'>
							<p>
								<span>Hello, {authUser?.name}.</span>
							</p>
							<p>How Can I Help You Today?</p>
						</div>
					</>
				) : (
					<div className='result'>
						<div className='result-title'>
							<img src={assets.user_icon} alt='' />
							<p>{recentPrompt}</p>
						</div>
						<div className='result-data'>
							<img src={assets.gemini_icon} alt='' />
							{loading ? (
								<div className='loader'>
									<hr />
									<hr />
									<hr />
								</div>
							) : (
								<p dangerouslySetInnerHTML={{ __html: resultData }}></p>
							)}
						</div>
					</div>
				)}

				<div className='main-bottom'>
					<div className='search-box'>
						<input
							onChange={(e) => setInput(e.target.value)}
							value={input}
							type='text'
							placeholder='Enter the Prompt Here'
						/>
						<div>
							<label htmlFor='upload-image'>
								<img src={assets.gallery_icon} alt='' style={{ cursor: 'pointer' }} />
							</label>
							<input
								id='upload-image'
								type='file'
								accept='image/*'
								style={{ display: 'none' }}
								onChange={handleImageUpload}
							/>
							<img src={assets.mic_icon} alt='' />
							{input ? (
								<img
									src={assets.send_icon}
									alt=''
									onClick={() => onSent()}
								/>
							) : null}
						</div>
						<button className='theme-toggle' onClick={toggleTheme}>
							{theme === 'light' ? <FaMoon color='white' /> : <FaSun color='white' />}
						</button>
					</div>
					{selectedImage && (
						<div className='image-preview'>
							<p>Preview:</p>
							<img src={selectedImage} alt='Uploaded Preview' />
						</div>
					)}
					<div className='bottom-info'>
						<p>
							AI Guru may display inaccurate info, including about people, so
							double-check its responses. Your privacy & CWTNet
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
