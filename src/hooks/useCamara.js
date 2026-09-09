import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hook para controlar la cámara del dispositivo mediante
 * `navigator.mediaDevices.getUserMedia()`.
 *
 * - Usa la cámara posterior (`facingMode: 'environment'`) cuando está
 *   disponible, típico en dispositivos móviles.
 * - Libera automáticamente la cámara al desmontar el componente (por
 *   ejemplo, al cambiar de vista), y también expone `detenerCamara`
 *   para liberarla manualmente.
 */
export const useCamara = () => {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [camaraActiva, setCamaraActiva] = useState(false)
  const [errorCamara, setErrorCamara] = useState('')

  const detenerCamara = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCamaraActiva(false)
  }, [])

  const activarCamara = useCallback(async () => {
    setErrorCamara('')

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorCamara('Este dispositivo o navegador no admite acceso a la cámara.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCamaraActiva(true)
    } catch (excepcion) {
      setErrorCamara(
        excepcion?.name === 'NotAllowedError'
          ? 'Se denegó el permiso de acceso a la cámara. Habilítelo en la configuración del navegador.'
          : 'No se pudo acceder a la cámara del dispositivo.',
      )
      setCamaraActiva(false)
    }
  }, [])

  /**
   * Captura el fotograma actual del video y lo devuelve como Blob JPEG,
   * junto con una URL de vista previa (`URL.createObjectURL`).
   */
  const capturarFoto = useCallback(() => {
    return new Promise((resolve, reject) => {
      const video = videoRef.current
      if (!video || !camaraActiva) {
        reject(new Error('La cámara no está activa.'))
        return
      }

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const contexto = canvas.getContext('2d')
      contexto.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('No se pudo generar la imagen capturada.'))
            return
          }
          resolve(blob)
        },
        'image/jpeg',
        0.92,
      )
    })
  }, [camaraActiva])

  // Libera la cámara automáticamente cuando el componente se desmonta
  // (por ejemplo, al navegar a otra vista del panel).
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return {
    videoRef,
    camaraActiva,
    errorCamara,
    activarCamara,
    detenerCamara,
    capturarFoto,
  }
}

export default useCamara
