"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import styled from 'styled-components';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (error) {
            setError("Correo o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledWrapper>
            <div className="card">
                <div className="card2">
                    <form onSubmit={handleSubmit} className="form">
                        <p id="heading">Iniciar sesión</p>
                        {error && <p className="error">{error}</p>}
                        <div className="field">
                            <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg" className="input-icon">
                                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
                            </svg>
                            <input type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required className="input-field"
                                autoComplete="off" />
                        </div>
                        <div className="field">
                            <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg" className="input-icon">
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                            </svg>
                            <input type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required className="input-field"
                                placeholder="Contraseña" />
                        </div>
                        <div className="btn">
                            <button className="button1" type='submit' disabled={loading}>
                                {loading ? "Cargando..." : "Iniciar sesión"}
                            </button>
                            <button type='button' className="button2">Registrarse</button>
                        </div>
                        <button type='button' className="button3">¿Olvidaste tu contraseña?</button>
                    </form>
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;

  .card {
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px;
    margin: 20px;
  }

  .card2 {
    border-radius: 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 2em;
    background-color: #f2f2f2;
    border-radius: 12px;
  }

  #heading {
    text-align: center;
    color: #333;
    font-size: 1.8em;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 2px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  }

  .input-icon {
    width: 18px;
    height: 18px;
    fill: #555;
  }

  .input-field {
    width: 100%;
    padding: 8px;
    color: #333;
    background: none;
    border: none;
    outline: none;
    font-size: 1em;
  }

  .input-field::placeholder {
    color: #aaa;
  }

  .btn {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }

  .button1, .button2, .button3 {
    padding: 12px 20px;
    border-radius: 8px;
    border: none;
    outline: none;
    font-size: 1em;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .button1 {
    border: 2px solid #4CAF50;
    color: #fff;
    background-color: #4CAF50;
  }

  .button1:hover {
    background-color: #45a049;
  }

  .button2 {
    border: 2px solid #2196F3;
    color: #fff;
    background-color: #2196F3;
  }

  .button2:hover {
    background-color: #0b7dda;
  }

  .button3 {
    border: 2px solid #FF6347;
    color: #fff;
    margin-top: 20px;
    background-color: #FF6347;
  }

  .button3:hover {
    background-color: #e5533d;
  }

  .error {
    color: red;
    font-size: 0.9em;
    text-align: center;
  }
`;

export default Login;
