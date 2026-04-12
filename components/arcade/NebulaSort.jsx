"use client";
import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, Stars, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Well({ position, name, color, onCapture, lowGraphics }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.02
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 + (hovered ? 0.15 : 0)
      ref.current.scale.set(s, s, s)
    }
  })

  return (
    <group 
      position={position}
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onCapture(name); }}
    >
      <mesh castShadow>
        <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          emissive={color} 
          emissiveIntensity={hovered ? 3 : 1.5} 
          metalness={1}
          roughness={0}
          wireframe 
        />
      </mesh>
      <pointLight intensity={2} color={color} distance={4} />
      <Text position={[0, -2.8, 0]} fontSize={0.5} color={color} fontWeight="900" anchorX="center" anchorY="middle">
        {name}
      </Text>
    </group>
  )
}

function FloatingTerm({ text, category, wells, onSort, speed, lowGraphics }) {
  const ref = useRef()
  const [captured, setCaptured] = useState(false)
  const [moving, setMoving] = useState(true)

  useFrame((state, delta) => {
    if (ref.current && moving && !captured) {
      ref.current.position.z += delta * speed
      if (ref.current.position.z > 5) {
        setCaptured(true)
        setMoving(false)
        onSort(false)
      }
    }
  })

  if (captured && !moving) return null

  return (
    <group ref={ref} position={[0, 0, -15]}>
      <Float speed={5} rotationIntensity={2} floatIntensity={1}>
        <mesh>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#ffffff" emissive="#6366f1" emissiveIntensity={2} metalness={0.8} roughness={0.2} />
        </mesh>
        <Text position={[0, 0, 1.1]} fontSize={0.3} color="white" maxWidth={2.5} textAlign="center">
          {text}
        </Text>
      </Float>
    </group>
  )
}

export default function NebulaSort({ studySet, lowGraphics, reduceMotion, onComplete, level }) {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  
  const questions = useMemo(() => {
    const mcqs = (studySet?.quizQuestions || []).filter(q => q.type === 'mcq')
    return mcqs.sort(() => Math.random() - 0.5)
  }, [studySet])

  const [activeIdx, setActiveIdx] = useState(0)
  const activeQ = questions[activeIdx]

  const wells = useMemo(() => {
    if (!activeQ) return []
    const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b"]
    return activeQ.options.map((opt, i) => {
      const angle = (i / activeQ.options.length) * Math.PI * 2
      const radius = 8
      return {
        name: opt,
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
        color: colors[i % colors.length]
      }
    })
  }, [activeQ])

  const onSort = (success) => {
    if (success) {
      const newScore = score + 200
      setScore(newScore)
      if (activeIdx + 1 >= questions.length) {
        setWin(true)
      } else {
        setActiveIdx(i => i + 1)
      }
    } else {
      const newHealth = health - 1
      setHealth(newHealth)
      if (newHealth <= 0) setGameOver(true)
    }
  }

  if (!activeQ) return null
  if (win) return <div className="game-overlay"><h2 style={{color:'#10b981'}}>DIMENSION STABILIZED</h2><button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button></div>
  if (gameOver) return <div className="game-overlay"><h2>COGNITIVE COLLAPSE</h2><button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button></div>

  return (
    <div style={{ height: '100%', background: '#000' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        <Environment preset="space" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        
        {wells.map(w => (
          <Well key={w.name} position={w.position} name={w.name} color={w.color} onCapture={(name) => onSort(name === activeQ.correct)} />
        ))}
        
        <FloatingTerm key={activeQ.id + activeIdx} text={activeQ.question} category={activeQ.correct} wells={wells} speed={2 + (level?.difficulty || 1) * 0.3} onSort={onSort} />
      </Canvas>
    </div>
  )
}
