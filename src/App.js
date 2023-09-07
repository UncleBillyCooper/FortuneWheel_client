import React, { useState, useEffect } from 'react';
import bridge, {send} from '@vkontakte/vk-bridge';


import './styles/App.css'

import Wheel from "./img/wheel.png";
import RouletPointer from "./img/wheel-pointer.png";
import Gold from "./img/coins.png";
import WinnerCard from "./components/WinnerCard";

import GoldBig from "./img/coins_big.png";



const App = () => {
	
	
	const [wheelAtrr, setWheel] = useState('roulet__wheel');
	const wheelArray = [
		{wClass: 'roulet__wheel s1', Value: 'JACKPOT'},
		{wClass: 'roulet__wheel s2', Value: '750'},
		{wClass: 'roulet__wheel s3', Value: '200'},
		{wClass: 'roulet__wheel s4', Value: '150'},
		{wClass: 'roulet__wheel s5', Value: '100'},
		{wClass: 'roulet__wheel s6', Value: '10'},
		{wClass: 'roulet__wheel s7', Value: '400'},
		{wClass: 'roulet__wheel s8', Value: '250'},
	];

	

	const [userCards, setUserCards] = useState([])
	const [currentUser, setCurrentUser] = useState([])
	const [lastRes, setLastRes] = useState()
	
	// Проверка нового пользователя на наличие в БД

	
	function checkUSER(uid, fn, sn, ava) {
		const requestOptions = {
			method: 'GET',
			redirect: 'follow'
		  };
		  
		  fetch(`http://localhost:3001/users?userID=${uid}&firstNAME=${fn}&surName=${sn}&avatar=${ava}`, requestOptions)
			.then(response => response.json())
			.then(result => /*console.log(result[0].balance)*/setCurrentUser(result[0]))
			.catch(error => console.log('error', error));
			
			
			console.log("f_checkUSER: Пользователь проверен")
	}

	// Получаем список победитлей

	function getWinnerList() {
		const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	  };
	  
	  fetch('http://localhost:3001/winners?search=all', requestOptions)
		.then(response => response.json())
		.then(result => setUserCards(result))
		.catch(error => console.log('error', error));
	  	
		console.log('f_getWinnerList: данные получены')
}

// Загрузка юзера в БД

	async function uploadUSER() {
		const user = await bridge.send('VKWebAppGetUserInfo', {});
		await getWinnerList();		
		await checkUSER(user.id, user.first_name, user.last_name, user.photo_200);
		// console.log('Текущий пользователь: '+currentUser)
		console.log(user.photo_200)
		// console.log(user.first_name)
		// console.log(user.last_name)
	}

// Создаем нового победителя

function createNewWinner(ava, fn, sn, lr) {
	const requestOptions = {
		method: 'POST',
		redirect: 'follow'
	  };
	  
	  fetch(`http://localhost:3001/winners?ava=${ava}&firstname=${fn}&surname=${sn}&lastres=${lr}`, requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));

	  console.log('f__createNewWinner: добавлен новый победитель')
}

// Выполняется при нажатии кнопки speen wheel
async function runWheel() {
	const x = Math.floor(Math.random() * (8 - 1 + 1)) + 1;	
	await setWheel(wheelArray[x].wClass);
	await wheelArray[x].Value==='JACKPOT' ? setLastRes(1000) : setLastRes(Number(wheelArray[x].Value));	
	setTimeout(function () {
		PopupON()
	}, 2500)
				
}

// Хук, вызывающий подгрузку данных при загрузке игры
useEffect(()=>{
	uploadUSER()				
}, [])

// Вносим изменения в базу по балансу

function updateBalance(uid, bl) {
	const requestOptions = {
		method: 'PUT',
		redirect: 'follow'
	  };
	  
	  fetch(`http://localhost:3001/users?userID=${uid}&bal=${bl}`, requestOptions)
		.then(response => response.text())
		.then(result => console.log('f_updateBalance: Баланс изменился: '+result[0].balance))
		.catch(error => console.log('error', error));
}


  // Включить попап

function PopupON() {
	const xxx = document.getElementsByClassName('popup_container')[0]
	//console.log(xxx)
	xxx.style.display = 'flex'

}

// выключить попап. выполняется при нажатии кнопки GREATE

async function PopupOFF() {
	const xxx = document.getElementsByClassName('popup_container')[0];
	xxx.style.display = 'none';	
	await createNewWinner(currentUser.ava, currentUser.firstname, currentUser.surname, lastRes);
	await updateBalance(currentUser.user_id, currentUser.balance + (lastRes - 1));
	await checkUSER(currentUser.user_id, currentUser.firstname, currentUser.surname, currentUser.ava);
	await getWinnerList();
	setWheel('roulet__wheel');
	
}


	return (
		<div className="App">
     
	 <header className='header'>
				{/* <div className='btnGroupe'>
					<img className='iconPoints'src={IconPoints} alt="иконка с точками"/>
					<img src={IconCencel} alt="крестик"/>
				</div> */}
			</header>
      <div className="content-container">
	  
		<h1>WHEEL OF FORTUNE</h1>
        <div className="roulet">
          <div className="roulet__box">
           
		  <div className='popup_container'>
			<div className='popup_container__block'>
				<h1>YOU WIN</h1>
				<div className='popup__result'>
					<h2>{lastRes}</h2>
					<img src={GoldBig}/>
				</div>
				<button className="popup__btn" onClick={PopupOFF}>GREAT</button>
			</div>
		  </div>
		  <img className={wheelAtrr} src={Wheel} alt="Рулетка"/>
			<img className='roulet__pointer' src={RouletPointer} alt="Указатель"/>
          </div>
          <div className="balance">
            <div>JACKPOT 1000</div>
            <div>BALANCE {currentUser.balance}</div>
            <button className="balance__btn" onClick={runWheel/*getWinnerList*/}>SPEEN WHEEL</button>
          </div>
        </div>
        <div className="winner_list">
          <h2>WINNERS </h2>
		  
          <div className="cards_list">
			
			{userCards.length !== 0 ? userCards.map(userCard => <WinnerCard gold={Gold} usCard={userCard} key={userCard.id_winner}/>) : "Список победителей пуст"}
		
			
		 
		   </div>
        </div>
      </div>
    </div>
	);
}

export default App;
