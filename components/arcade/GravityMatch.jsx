"use client";
import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'

function FloatingTile({ text, tileId, isDefinition, onSelect, activeId, matchedIds, reduceMotion }) {
  const ref = useRef()
  const isMatched = matchedIds.has(tileId)
  const isActive = activeId === tileId
  
  useFrame((state) => {
    if (ref.current && !isMatched && !reduceMotion) {
      ref.current.rotation.y += 0.005
      ref.current.position.y += Math.sin(state.clock.elapsedTime + tileId.charCodeAt(0)) * 0.002
    }
  })

  if (isMatched) return null

  return (
    <Float speed={reduceMotion ? 0 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} onClick={() => onSelect(tileId, isDefinition)}>
        <boxGeometry args={[2.8, 1.4, 0.1]} />
        <meshStandardMaterial 
          color={isActive ? "#6366f1" : "white"} 
          transparent 
          opacity={isActive ? 0.9 : 0.8} 
          emissive={isActive ? "#6366f1" : isDefinition ? "#ec4899" : "#10b981"}
          emissiveIntensity={isActive ? 2 : 0.4}
          metalness={1}
          roughness={0}
        />
        <Text position={[0, 0, 0.06]} fontSize={0.2} color={isActive ? "white" : "black"} maxWidth={2.4} textAlign="center" anchorX="center" anchorY="middle">
          {text}
        </Text>
      </mesh>
      {isActive && <pointLight intensity={2} color="#6366f1" distance={5} />}
    </Float>
  )
}

export default function GravityMatch({ studySet, lowGraphics, reduceMotion, onComplete, level }) {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  const [activeTerm, setActiveTerm] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState(new Set())
  
  const tiles = useMemo(() => {
    const cardLimit = 3 + (level?.difficulty || 1) * 1
    const cards = (studySet.flashcards || []).slice(0, Math.min(studySet.flashcards?.length || 0, cardLimit))
    const all = []
    cards.forEach((c, idx) => {
      const cardId = `card-${idx}`
      const row = idx % 4
      const col = Math.floor(idx / 4)
      all.push({ tileId: `term-${cardId}`, cardId, text: c.front, isDef: false, pos: [-5, 3 - row * 2, col * 2] })
      all.push({ tileId: `def-${cardId}`, cardId, text: c.back, isDef: true, pos: [5, 3 - row * 2, col * 2] })
    })
    return all.sort(() => Math.random() - 0.5)
  }, [studySet, level])

  const handleTileSelect = (tileId, isDef) => {
    if (matchedPairs.has(tileId)) return
    if (!activeTerm) { setActiveTerm(tileId); return }
    if (activeTerm === tileId) { setActiveTerm(null); return }

    const activeCardId = activeTerm.split('-')[1]
    const currentCardId = tileId.split('-')[1]
    const isActiveDefType = activeTerm.startsWith('def-')
    const isCurrentDefType = tileId.startsWith('def-')

    if (activeCardId === currentCardId && isActiveDefType !== isCurrentDefType) {
      setMatchedPairs(prev => new Set([...prev, activeTerm, tileId]))
      const newScore = score + 100
      setScore(newScore)
      setActiveTerm(null)
      if (newScore >= (tiles.length / 2) * 100) setWin(true)
    } else {
      setHealth(h => { const nh = h - 1; if (nh <= 0) setGameOver(true); return nh })
      setActiveTerm(tileId)
    }
  }

  if (win) return <div className="game-overlay"><h2 style={{color:'#10b981'}}>PERFECT ALIGNMENT</h2><button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button></div>
  if (gameOver) return <div className="game-overlay"><h2>GRAVITY COLLAPSE</h2><button className="btn primary" onClick={() => onComplete(score)}>Claim XP</button></div>

  return (
    <div style={{ height: '100%', background: '#050816' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={lowGraphics ? 1.2 : 1} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        {tiles.map((t) => (
          <group key={t.tileId} position={t.pos}>
            <FloatingTile text={t.text} tileId={t.tileId} isDefinition={t.isDef} activeId={activeTerm} matchedIds={matchedPairs} onSelect={handleTileSelect} reduceMotion={reduceMotion} />
          </group>
        ))}
      </Canvas>
    </div>
  )
}
