"use client";
import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, PerspectiveCamera, Environment, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

function Ship({ position, health }) {
  return (
    <group position={position}>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh castShadow>
          <coneGeometry args={[0.4, 1.2, 3]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={5} metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.3, 3]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={health > 0 ? 3 : 0} />
        </mesh>
        <pointLight intensity={2} color="#6366f1" distance={5} />
      </Float>
    </group>
  )
}

function Asteroid({ position, answer, isCorrect, level, lowGraphics, onHit, onMiss }) {
  const ref = useRef()
  const [active, setActive] = useState(true)
  const rotVel = useRef([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5])

  useFrame((state, delta) => {
    if (ref.current && active) {
      ref.current.position.z += (5 + (level?.difficulty || 1) * 1.5) * delta
      ref.current.rotation.x += rotVel.current[0] * delta
      ref.current.rotation.y += rotVel.current[1] * delta
      
      if (ref.current.position.z > 10) {
        setActive(false)
        if (isCorrect) onMiss()
      }
    }
  })

  const handleShot = () => {
    if (!active) return
    setActive(false)
    onHit(isCorrect)
  }

  if (!active) return null

  return (
    <group ref={ref} position={position} onClick={(e) => { e.stopPropagation(); handleShot(); }}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.6, 4]} />
        <meshStandardMaterial 
          color={isCorrect ? "#10b981" : "#f43f5e"} 
          emissive={isCorrect ? "#10b981" : "#f43f5e"} 
          emissiveIntensity={lowGraphics ? 1 : 1.5} 
        />
      </mesh>
      <Text fontSize={0.25} color="white" position={[0, 0, 0.65]} anchorX="center" anchorY="middle" maxWidth={1.5}>
        {answer}
      </Text>
    </group>
  )
}

export default function StellarStriker({ studySet, lowGraphics, reduceMotion, onComplete, level }) {
  const [playerPos, setPlayerPos] = useState([0, -3, 0])
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  const [asteroids, setAsteroids] = useState([])
  const [gameTime, setGameTime] = useState(0)

  const questions = useMemo(() => studySet.quizQuestions?.filter(q => q.type === 'mcq') || [], [studySet])
  const [currentQuestion, setCurrentQuestion] = useState(null)

  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)])
    }
  }, [questions, currentQuestion])

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(t => {
        if (t >= 60) { setWin(true); return 60 }
        return t + 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerPos(p => {
        if (e.key === 'ArrowLeft' || e.key === 'a') return [Math.max(p[0] - 0.5, -4), p[1], p[2]]
        if (e.key === 'ArrowRight' || e.key === 'd') return [Math.min(p[0] + 0.5, 4), p[1], p[2]]
        if (e.key === 'ArrowUp' || e.key === 'w') return [p[0], Math.min(p[1] + 0.5, 3), p[2]]
        if (e.key === 'ArrowDown' || e.key === 's') return [p[0], Math.max(p[1] - 0.5, -3), p[2]]
        return p
      })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (!gameOver && !win && currentQuestion) {
        const isAnswer = Math.random() < 0.4
        const ans = isAnswer ? currentQuestion.correct : currentQuestion.options.filter(o => o !== currentQuestion.correct)[Math.floor(Math.random() * (currentQuestion.options.length - 1))]
        setAsteroids(prev => [...prev, { id: Math.random(), x: (Math.random() - 0.5) * 12, y: (Math.random() - 0.5) * 8, answer: ans, isCorrect: isAnswer, z: -25 }].slice(-15))
      }
    }, 1200 - (level?.difficulty || 1) * 100)
    return () => clearInterval(spawnInterval)
  }, [gameOver, win, currentQuestion])

  const onHit = (correct) => {
    if (correct) setScore(s => s + 150)
    else setHealth(h => { const nh = h - 1; if (nh <= 0) setGameOver(true); return nh })
  }

  const onMiss = () => {
    setHealth(h => { const nh = h - 1; if (nh <= 0) setGameOver(true); return nh })
  }

  if (win) return <div className="game-overlay"><h2 style={{color:'#fbbf24'}}>SECTOR SECURED</h2><button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button></div>
  if (gameOver) return <div className="game-overlay"><h2>SHIELD BREACHED</h2><button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button></div>

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
        <ambientLight intensity={lowGraphics ? 1 : 0.5} />
        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        <Environment preset="space" />
        <Ship position={playerPos} health={health} />
        {currentQuestion && asteroids.map(ast => (
          <Asteroid key={ast.id} position={[ast.x, ast.y, ast.z]} answer={ast.answer} isCorrect={ast.isCorrect} level={level} lowGraphics={lowGraphics} onHit={onHit} onMiss={onMiss} />
        ))}
      </Canvas>
      <div className="game-ui">Score: {score} | Health: {health} | Time: {gameTime}s</div>
    </div>
  )
}
