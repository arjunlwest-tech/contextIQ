"use client";
import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, Stars, MeshTransmissionMaterial, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function CameraRig({ height }) {
  useFrame((state) => {
    const targetY = 8 + height * 3.5
    const targetZ = 12
    state.camera.position.lerp(new THREE.Vector3(0, targetY, targetZ), 0.05)
    state.camera.lookAt(0, height * 3.5, -5)
  })
  return null
}

function Pillar({ position, text, isCorrect, onLeap, lowGraphics, active }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (ref.current) {
      const targetScale = hovered || active ? 1.2 : 1
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      if (hovered || active) {
        ref.current.position.y += Math.sin(state.clock.elapsedTime * 5) * 0.01
      }
    }
  })
  
  return (
    <group 
      position={position}
      onClick={() => onLeap(isCorrect)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.4, 2.2]} />
        <meshStandardMaterial 
          color={active ? "#10b981" : hovered ? "#6366f1" : "#334155"} 
          emissive={active ? "#10b981" : hovered ? "#6366f1" : "#334155"}
          emissiveIntensity={hovered || active ? 2 : 0.2}
          metalness={1}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, -5, 0]}>
        <boxGeometry args={[1.8, 10, 1.8]} />
        {lowGraphics ? (
          <meshStandardMaterial color="#050816" transparent opacity={0.8} />
        ) : (
          <MeshTransmissionMaterial alphaHash background={new THREE.Color('#050816')} transmission={1} />
        )}
      </mesh>
      <Text position={[0, 0.6, 0]} fontSize={0.25} color="white" rotation={[-Math.PI / 4, 0, 0]} maxWidth={1.8} anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  )
}

export default function VoidClimb({ studySet, lowGraphics, reduceMotion, onComplete, level }) {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  const [height, setHeight] = useState(0)
  
  const questions = useMemo(() => (studySet.quizQuestions || []).filter(q => q.type === 'mcq'), [studySet])
  const baseSpacing = 3 + (level?.difficulty || 1) * 0.2
  const [activeQIdx, setActiveQIdx] = useState(0)
  const activeQ = questions[activeQIdx]

  const handleLeap = (correct) => {
    if (correct) {
      const newScore = score + 250
      setScore(newScore); setHeight(height + 1)
      if (activeQIdx + 1 >= questions.length) setWin(true)
      else setActiveQIdx(i => i + 1)
    } else {
      const newHealth = health - 1
      setHealth(newHealth); if (newHealth <= 0) setGameOver(true)
    }
  }

  if (gameOver) return <div className="game-overlay"><h2>FALLEN FROM GRACE</h2><button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button></div>
  if (win || !activeQ) return <div className="game-overlay"><h2 style={{color:'#10b981'}}>APEX REACHED</h2><button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button></div>

  return (
    <div style={{ height: '100%', background: '#050816' }}>
      <Canvas shadows>
        <fog attach="fog" args={['#050816', 5, 25]} />
        <CameraRig height={height} />
        <mesh position={[0, -1, 0]} receiveShadow><boxGeometry args={[10, 0.5, 10]} /><meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} /></mesh>
        {questions.map((q, qIdx) => (
          <group key={qIdx} position={[0, qIdx * 3.5, -5]}>
            {qIdx === activeQIdx && (
              <>
                <Text position={[0, 4.5, -2]} fontSize={0.6} color="white" maxWidth={10} anchorX="center" anchorY="middle">{q.question}</Text>
                {q.options.map((opt, i) => (
                  <Pillar key={i + opt} position={[(i - (q.options.length-1)/2) * baseSpacing, 0, 0]} text={opt} isCorrect={opt === q.correct} onLeap={handleLeap} lowGraphics={lowGraphics} active={false} />
                ))}
              </>
            )}
            {qIdx < activeQIdx && (
               <Pillar position={[0, 0, 0]} text="SECURED" isCorrect={true} onLeap={() => {}} lowGraphics={lowGraphics} active={true} />
            )}
          </group>
        ))}
        {!lowGraphics && <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />}
      </Canvas>
    </div>
  )
}
