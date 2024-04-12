import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import axios from "axios";
import {usePlaidLink} from 'react-plaid-link'
import viteLogo from '/vite.svg'
//import './App.css'
axios.defaults.baseURL ="http://localhost:8000"

function PlaidAuth({publicToken}) {
     const [account, setAccount] = useState();
     useEffect(() => {
          async function fetchData() {
               let accessToken = await axios.post("/exchange_public_token", {public_token: publicToken});
               console.log("Access Token: ", accessToken.data);
               const auth = await axios.post("/auth", {access_token: accessToken.data.accessToken});
               console.log("auth data: ", auth.data);
               setAccount(auth.data.numbers.ach[0]);

          }
          fetchData();
     }, [])
     return account && (
          <>
               <p>Account Number: {account.account} </p>
               <p>Routing Number: {account.routing} </p>
          </>
          
     );
}



function App() {
     const [linkToken, setLinkToken] = useState();
     const [publicToken, setPublicToken] = useState();
     useEffect(() => {
           async function fetch() {
               try {
                    const response = await axios.post("/create_link_token");
                    setLinkToken(response.data.link_token);
                } catch (error) {
                    console.error("There was an error!", error);
                }
          }
          fetch();
     }, []);
	const { open, ready } = usePlaidLink({
          token: linkToken,
          onSuccess: (public_token, metadata) => {
               setPublicToken(public_token);
               console.log("Success ", public_token, metadata)
          },
        });
        
        return publicToken ? (<PlaidAuth publicToken = {publicToken}/>) : (
          <button onClick={() => open()} disabled={!ready}>
            Connect a bank account
          </button>
        );
}

export default App;
