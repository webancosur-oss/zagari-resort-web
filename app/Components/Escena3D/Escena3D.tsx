"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Colores de la paleta oficial de zagari.pe. */
const C = {
  aguaProfunda: "#0f7fa3",
  aguaClara: "#4ab8d8",
  madera: "#9a6b3f",
  maderaOscura: "#6f4c2c",
  piedra: "#d9d2c3",
  piedraBorde: "#c8ceca",
  tronco: "#8b6b4f",
  cabana: "#26312b",
  vidrio: "#9fd3e6",
  verdes: ["#0d6b47", "#17a857", "#42b979", "#1c5947", "#2d7b60"],
  montana: ["#5f8a7a", "#4f7a6a", "#6e9a88"],
  cieloAlto: "#6fb8e2",
  horizonte: "#d9eef3",
  niebla: "#cfe5ea",
  cojin: "#fbf8f1",
};

/** Pequeño generador determinista: la escena es igual en cada carga. */
function aleatorio(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const VERTICE = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vMundo;
  void main() {
    vUv = uv;
    vec4 mundo = modelMatrix * vec4(position, 1.0);
    vMundo = mundo.xyz;
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }
`;

const AGUA = /* glsl */ `
  uniform float uTiempo;
  uniform vec3 uProfunda;
  uniform vec3 uClara;
  varying vec2 vUv;
  void main() {
    float a = sin(vUv.x * 22.0 + uTiempo * 0.7);
    float b = sin(vUv.y * 15.0 - uTiempo * 0.5 + vUv.x * 4.0);
    float brillo = smoothstep(0.62, 1.0, a * b) * 0.32;
    vec3 color = mix(uProfunda, uClara, 0.25 + vUv.y * 0.55) + brillo;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const CIELO = /* glsl */ `
  uniform vec3 uAlto;
  uniform vec3 uHorizonte;
  varying vec3 vMundo;
  void main() {
    float h = clamp(normalize(vMundo).y * 2.4, 0.0, 1.0);
    gl_FragColor = vec4(mix(uHorizonte, uAlto, pow(h, 0.8)), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

interface Estado {
  /** Puntero normalizado de -1 a 1, relativo a la ventana. */
  puntero: { x: number; y: number };
  quieto: boolean;
}

function Cielo() {
  const uniforms = useMemo(
    () => ({
      uAlto: { value: new THREE.Color(C.cieloAlto) },
      uHorizonte: { value: new THREE.Color(C.horizonte) },
    }),
    []
  );
  return (
    <mesh>
      <sphereGeometry args={[150, 24, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        vertexShader={VERTICE}
        fragmentShader={CIELO}
        uniforms={uniforms}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

function Agua({ quieto }: { quieto: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTiempo: { value: 0 },
      uProfunda: { value: new THREE.Color(C.aguaProfunda) },
      uClara: { value: new THREE.Color(C.aguaClara) },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!quieto && material.current) material.current.uniforms.uTiempo.value += delta;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0.6, -0.08, -1.2]}>
      <planeGeometry args={[7.5, 3.6]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERTICE}
        fragmentShader={AGUA}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Caja({
  pos,
  tam,
  color,
  rot = [0, 0, 0],
}: {
  pos: [number, number, number];
  tam: [number, number, number];
  color: string;
  rot?: [number, number, number];
}) {
  return (
    <mesh position={pos} rotation={rot}>
      <boxGeometry args={tam} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

/** Terraza en tres piezas: el hueco central es la piscina. */
function Terraza() {
  return (
    <group>
      <Caja pos={[0, -0.3, 4.8]} tam={[22, 0.6, 8.4]} color={C.piedra} />
      <Caja pos={[-6.6, -0.3, -1.2]} tam={[6.9, 0.6, 3.6]} color={C.piedra} />
      <Caja pos={[7.7, -0.3, -1.2]} tam={[6.7, 0.6, 3.6]} color={C.piedra} />
      {/* Borde de piedra y desborde del borde infinito. */}
      <Caja pos={[0.6, 0.02, 0.68]} tam={[7.9, 0.08, 0.16]} color={C.piedraBorde} />
      <Caja pos={[0.6, -0.5, -3.05]} tam={[7.5, 0.9, 0.1]} color={C.aguaProfunda} />
    </group>
  );
}

function Pergola() {
  const listones = Array.from({ length: 8 }, (_, i) => i);
  return (
    <group position={[7.6, 0, 3.2]} rotation-y={-0.35} scale={0.9}>
      <Caja pos={[0, 0.03, 0]} tam={[4, 0.06, 3.2]} color={C.madera} />
      {[
        [-1.7, -1.3],
        [1.7, -1.3],
        [-1.7, 1.3],
        [1.7, 1.3],
      ].map(([x, z]) => (
        <Caja key={`${x}${z}`} pos={[x, 1.25, z]} tam={[0.12, 2.5, 0.12]} color={C.maderaOscura} />
      ))}
      {listones.map((i) => (
        <Caja key={i} pos={[0, 2.52, -1.4 + i * 0.4]} tam={[3.8, 0.08, 0.12]} color={C.madera} />
      ))}
      {[-0.7, 0.7].map((x) => (
        <group key={x} position={[x, 0, 0.2]}>
          <Caja pos={[0, 0.2, 0]} tam={[0.7, 0.16, 1.7]} color={C.cojin} />
          <Caja pos={[0, 0.42, -0.72]} tam={[0.7, 0.5, 0.12]} color={C.cojin} rot={[-0.5, 0, 0]} />
        </group>
      ))}
    </group>
  );
}

/** Cabaña en A, como la arquitectura negra real del club. */
function Cabana() {
  const [techo, vidrio] = useMemo(() => {
    const forma = new THREE.Shape();
    forma.moveTo(-1.3, 0);
    forma.lineTo(1.3, 0);
    forma.lineTo(0, 3);
    forma.closePath();
    const t = new THREE.ExtrudeGeometry(forma, { depth: 3.2, bevelEnabled: false });
    t.translate(0, 0, -1.6);

    const frente = new THREE.Shape();
    frente.moveTo(-0.95, 0.05);
    frente.lineTo(0.95, 0.05);
    frente.lineTo(0, 2.25);
    frente.closePath();
    return [t, new THREE.ShapeGeometry(frente)];
  }, []);

  useEffect(
    () => () => {
      techo.dispose();
      vidrio.dispose();
    },
    [techo, vidrio]
  );

  return (
    <group position={[8.6, 0, -1.9]} rotation-y={-0.65} scale={0.85}>
      <mesh geometry={techo}>
        <meshStandardMaterial color={C.cabana} roughness={0.7} />
      </mesh>
      <mesh geometry={vidrio} position={[0, 0, 1.61]}>
        <meshStandardMaterial color={C.vidrio} roughness={0.15} metalness={0.2} emissive={C.vidrio} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Palmera({
  pos,
  escala = 1,
  fase,
  quieto,
}: {
  pos: [number, number, number];
  escala?: number;
  fase: number;
  quieto: boolean;
}) {
  const copa = useRef<THREE.Group>(null);

  const tronco = useMemo(() => {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.12, 1.4, 0.05),
      new THREE.Vector3(0.35, 2.8, 0.1),
      new THREE.Vector3(0.55, 3.9, 0.12),
    ]);
    return new THREE.TubeGeometry(curva, 16, 0.09, 6, false);
  }, []);

  useEffect(() => () => tronco.dispose(), [tronco]);

  useFrame(({ clock }) => {
    if (quieto || !copa.current) return;
    const t = clock.elapsedTime;
    copa.current.rotation.z = Math.sin(t * 0.8 + fase) * 0.05;
    copa.current.rotation.x = Math.cos(t * 0.6 + fase) * 0.035;
  });

  const hojas = Array.from({ length: 8 }, (_, i) => i);

  return (
    <group position={pos} scale={escala}>
      <mesh geometry={tronco}>
        <meshStandardMaterial color={C.tronco} roughness={0.9} />
      </mesh>
      <group ref={copa} position={[0.55, 3.9, 0.12]}>
        {hojas.map((i) => (
          <group key={i} rotation-y={(i / hojas.length) * Math.PI * 2 + fase}>
            <mesh position={[0, -0.25, 0.85]} rotation-x={0.42} scale={[0.17, 0.035, 1]}>
              <sphereGeometry args={[1, 8, 6]} />
              <meshStandardMaterial
                color={C.verdes[(i + Math.round(fase * 3)) % 3]}
                roughness={0.8}
                flatShading
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Copas de selva bajo el borde infinito: una sola malla instanciada. */
function Selva({ cantidad }: { cantidad: number }) {
  const malla = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const m = malla.current;
    if (!m) return;
    const azar = aleatorio(7);
    const auxiliar = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < cantidad; i++) {
      const lado = (azar() - 0.5) * 70;
      const fondo = -7 - azar() * 36;
      // La selva cae hacia el valle: cuanto más lejos, más abajo.
      auxiliar.position.set(lado, -5.2 + azar() * 1.6 + (fondo + 7) * 0.12, fondo);
      const s = 1.1 + azar() * 1.8;
      auxiliar.scale.set(s, s * (0.7 + azar() * 0.4), s);
      auxiliar.rotation.set(azar(), azar() * 6, azar());
      auxiliar.updateMatrix();
      m.setMatrixAt(i, auxiliar.matrix);
      m.setColorAt(i, color.set(C.verdes[Math.floor(azar() * C.verdes.length)]));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [cantidad]);

  return (
    <instancedMesh ref={malla} args={[undefined, undefined, cantidad]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.9} flatShading />
    </instancedMesh>
  );
}

function Arbustos() {
  const azar = aleatorio(31);
  const puntos: Array<[number, number, number, number, string]> = [];
  for (let i = 0; i < 14; i++) {
    const izquierda = i % 2 === 0;
    const x = izquierda ? -10 + azar() * 4.5 : 9.5 + azar() * 1.5;
    const z = -2.6 + azar() * 9;
    puntos.push([x, 0.25, z, 0.45 + azar() * 0.55, C.verdes[i % C.verdes.length]]);
  }
  return (
    <group>
      {puntos.map(([x, y, z, s, color], i) => (
        <mesh key={i} position={[x, y * s * 2, z]} scale={[s * 1.3, s, s * 1.3]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={color} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Montanas() {
  const datos: Array<[number, number, number, number, number]> = [
    [-50, -84, 36, 15, 0],
    [-16, -92, 42, 19, 1],
    [20, -86, 38, 16, 2],
    [56, -96, 44, 20, 0],
    [2, -70, 28, 9, 2],
    [-34, -66, 24, 8, 1],
  ];
  return (
    <group>
      {datos.map(([x, z, r, h, c], i) => (
        <mesh key={i} position={[x, -10 + h / 2, z]} rotation-y={i}>
          <coneGeometry args={[r, h, 9]} />
          <meshStandardMaterial color={C.montana[c]} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** Deriva lenta de cámara más respuesta suave al puntero. */
function Camara({ estado }: { estado: React.RefObject<Estado> }) {
  const mira = useMemo(() => new THREE.Vector3(1.2, 0.5, -4), []);
  const destino = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock, size }, delta) => {
    const { puntero, quieto } = estado.current;
    const t = quieto ? 0 : clock.elapsedTime;
    const vertical = size.width < size.height;
    destino.set(
      (vertical ? 1.6 : 0.4) + Math.sin(t * 0.11) * 0.7 + puntero.x * 0.9,
      (vertical ? 5.6 : 4.4) + Math.sin(t * 0.08) * 0.18 + puntero.y * 0.35,
      (vertical ? 19 : 14) + Math.cos(t * 0.09) * 0.4
    );
    const suavizado = quieto ? 1 : 1 - Math.pow(0.04, delta);
    camera.position.lerp(destino, suavizado);
    camera.lookAt(mira);
  });
  return null;
}

export interface Escena3DProps {
  /** Se llama tras el primer fotograma, para fundir la escena sobre la foto. */
  onListo?: () => void;
}

export default function Escena3D({ onListo }: Escena3DProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const estado = useRef<Estado>({ puntero: { x: 0, y: 0 }, quieto: false });
  const [visible, setVisible] = useState(true);
  const [quieto, setQuieto] = useState(false);
  const [movil, setMovil] = useState(false);

  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const estrecho = window.matchMedia("(max-width: 699.98px)");
    const aplicar = () => {
      estado.current.quieto = reducido.matches;
      setQuieto(reducido.matches);
      setMovil(estrecho.matches);
    };
    aplicar();
    reducido.addEventListener("change", aplicar);
    estrecho.addEventListener("change", aplicar);

    const alMover = (e: PointerEvent) => {
      estado.current.puntero.x = (e.clientX / window.innerWidth) * 2 - 1;
      estado.current.puntero.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", alMover, { passive: true });

    // Fuera de pantalla o con la pestaña oculta no se dibuja nada.
    let enPantalla = true;
    const actualizar = () => setVisible(enPantalla && !document.hidden);
    const observador = new IntersectionObserver(([e]) => {
      enPantalla = e.isIntersecting;
      actualizar();
    });
    if (contenedor.current) observador.observe(contenedor.current);
    document.addEventListener("visibilitychange", actualizar);

    return () => {
      reducido.removeEventListener("change", aplicar);
      estrecho.removeEventListener("change", aplicar);
      window.removeEventListener("pointermove", alMover);
      observador.disconnect();
      document.removeEventListener("visibilitychange", actualizar);
    };
  }, []);

  const bucle = !visible ? "never" : quieto ? "demand" : "always";

  return (
    <div ref={contenedor} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop={bucle}
        dpr={[1, movil ? 1.5 : 1.75]}
        camera={{ fov: 42, near: 0.1, far: 400, position: [0.4, 4.4, 14] }}
        gl={{ antialias: !movil, powerPreference: "high-performance" }}
        onCreated={() => requestAnimationFrame(() => onListo?.())}
      >
        <fog attach="fog" args={[C.niebla, 30, 120]} />
        <hemisphereLight args={["#e9f6ff", "#9a6b3f", 1.1]} />
        <directionalLight position={[7, 11, 5]} intensity={2.3} color="#fff4dc" />

        <Cielo />
        <Montanas />
        <Selva cantidad={movil ? 70 : 140} />
        <Terraza />
        <Agua quieto={quieto} />
        <Pergola />
        <Cabana />
        <Arbustos />
        <Palmera pos={[-4.5, 0, -1.9]} escala={1.05} fase={0.4} quieto={quieto} />
        <Palmera pos={[-6.4, 0, 1.4]} escala={0.9} fase={1.7} quieto={quieto} />
        <Palmera pos={[-8.2, 0, -2.4]} escala={1.2} fase={2.6} quieto={quieto} />
        <Palmera pos={[4.6, 0, -2.4]} escala={0.95} fase={3.3} quieto={quieto} />
        <Palmera pos={[9.2, 0, 1.8]} escala={1.1} fase={4.1} quieto={quieto} />

        <Camara estado={estado} />
      </Canvas>
    </div>
  );
}
