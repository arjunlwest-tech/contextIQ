"use client";
import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, PerspectiveCamera, Stars, Environment, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function AnswerGate({ position, text, isCorrect, lowGraphics }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05
      ref.current.scale.set(s, s, s)
    }
  })

  return (
    <group position={position}>
      <mesh ref={ref}>
        <torusGeometry args={[1.2, 0.08, 16, 64]} />
        <meshStandardMaterial 
          color={isCorrect ? "#10b981" : "#6366f1"} 
          emissive={isCorrect ? "#10b981" : "#6366f1"} 
          emissiveIntensity={lowGraphics ? 1.5 : 4} 
          transparent 
          opacity={0.8}
          metalness={1}
          roughness={0}
        />
      </mesh>
      <Text position={[0, 0, 0.15]} fontSize={0.25} color="white" maxWidth={2.2} textAlign="center" anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  )
}

function Player({ position, targetLane }) {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetLane * 3, 0.15)
    }
  })

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <octahedronGeometry args={[0.6, 2]} />
        <MeshDistortMaterial 
          color="#ffffff" 
          emissive="#6366f1" 
          emissiveIntensity={2} 
          distort={0.4} 
          speed={5}
          metalness={1}
          roughness={0}
        />
      </mesh>
      <pointLight intensity={1} color="#6366f1" position={[0, 0, 0]} distance={5} />
    </group>
  )
}

function Track({ speed }) {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.z += speed * delta
      if (ref.current.position.z > 20) ref.current.position.z = -50
    }
  })

  return (
    <group>
      <gridHelper ref={ref} args={[100, 20, "#1e293b", "#6366f1"]} rotation={[0, 0, 0]} position={[0, -1, -25]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, -25]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function MovingGate({ position, speed, text, isCorrect, targetLane, onAction, lowGraphics }) {
  const ref = useRef()
  const [processed, setProcessed] = useState(false)

  useFrame((state, delta) => {
    if (ref.current && !processed) {
      ref.current.position.z += speed * delta
      
      if (ref.current.position.z > -0.5 && ref.current.position.z < 0.5) {
        if (targetLane === Math.round(position[0] / 3)) {
          setProcessed(true)
          onAction('hit', isCorrect)
        }
      }

      if (ref.current.position.z > 3) {
        setProcessed(true)
        onAction('miss', isCorrect)
      }
    }
  })

  return (
    <group ref={ref} position={position}>
      <AnswerGate text={text} isCorrect={isCorrect} lowGraphics={lowGraphics} />
    </group>
  )
}

export default function VantageRun({ studySet, lowGraphics, reduceMotion, onComplete, level }) {
  const [lane, setLane] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(null)
  
  const baseSpeed = 4 + (level?.difficulty || 1) * 0.5
  const [speed, setSpeed] = useState(baseSpeed)
  
  const questions = useMemo(() => studySet.quizQuestions?.filter(q => q.type === 'mcq') || [], [studySet])

  useEffect(() => {
    if (!activeQuestion && questions.length > 0) {
      const q = questions[Math.floor(Math.random() * questions.length)]
      setActiveQuestion(q)
    }
  }, [activeQuestion, questions])

  const handleAction = (action, isCorrect) => {
    if (action === 'hit') {
      if (isCorrect) {
        const newScore = score + 100
        setScore(newScore)
        setSpeed(s => Math.min(s + 0.05, 12))
        if (newScore >= 300) {
          setWin(true)
        } else {
          setActiveQuestion(null)
        }
      } else {
        setGameOver(true)
      }
    } else if (action === 'miss' && isCorrect) {
      setGameOver(true)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') setLane(l => Math.max(l - 1, -1))
      if (e.key === 'ArrowRight' || e.key === 'd') setLane(l => Math.min(l + 1, 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (win) {
    return (
      <div className="game-overlay win" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050816', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#10b981' }}>MISSION ACCOMPLISHED</h2>
        <p>Phase {level?.difficulty || '01'} Complete - Final Score: {score}</p>
        <button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="game-overlay game-over" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050816', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>NEURAL LINK SEVERED</h2>
        <p>Session Failed at Score {score}</p>
        <button className="btn primary" onClick={() => onComplete(score)}>Claim Partial XP</button>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'none' }}>
      <Canvas shadows={!lowGraphics}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
        <ambientLight intensity={lowGraphics ? 1.0 : 0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />

        <Player position={[0, 0, 0]} targetLane={lane} />
        <Track speed={speed} />

        {activeQuestion && (
          <group>
            <Text position={[0, 4, -10]} fontSize={0.6} color="white" maxWidth={8} textAlign="center">
              {activeQuestion.question}
            </Text>
            {activeQuestion.options.map((opt, idx) => {
              const xPos = (idx - 1) * 3
              return (
                <MovingGate 
                  key={activeQuestion.id + opt} 
                  position={[xPos, 0, -35]} 
                  speed={speed} 
                  text={opt} 
                  isCorrect={opt === activeQuestion.correct} 
                  targetLane={lane}
                  lowGraphics={lowGraphics}
                  onAction={handleAction} 
                />
              )
            })}
          </group>
        )}
      </Canvas>
    </div>
  )
}
