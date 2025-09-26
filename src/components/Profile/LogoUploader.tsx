import React, { useState, useRef } from 'react'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Upload, Image as ImageIcon, Loader2, Save } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface LogoUploaderProps {
  currentLogoUrl?: string | null
  onUploadSuccess: (url: string) => void
}

const ASPECT_RATIO = 1
const MIN_DIMENSION = 150

const LogoUploader: React.FC<LogoUploaderProps> = ({ currentLogoUrl, onUploadSuccess }) => {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState<Crop>()
  const [isUploading, setIsUploading] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '')
    })
    reader.readAsDataURL(file)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const crop = makeAspectCrop({ unit: '%', width: 50 }, ASPECT_RATIO, width, height)
    const centeredCrop = centerCrop(crop, width, height)
    setCrop(centeredCrop)
  }

  const handleUpload = async () => {
    if (!imgRef.current || !crop) {
      toast.error('Veuillez sélectionner et recadrer une image.')
      return
    }

    setIsUploading(true)
    const toastId = toast.loading('Téléchargement du logo...')

    try {
      const canvas = document.createElement('canvas')
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height
      canvas.width = Math.floor(crop.width * scaleX)
      canvas.height = Math.floor(crop.height * scaleY)
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0, 0,
        canvas.width,
        canvas.height
      )

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('Could not create blob from canvas')

      const filePath = `public/logo-${Date.now()}.png`
      const { data, error } = await supabase.storage
        .from('organization_assets')
        .upload(filePath, blob, { upsert: true })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage.from('organization_assets').getPublicUrl(data.path)
      
      onUploadSuccess(publicUrl)
      setImgSrc('')
      toast.success('Logo téléchargé avec succès !', { id: toastId })
    } catch (error: any) {
      toast.error(`Échec du téléchargement : ${error.message}`, { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Logo de l'organisation</label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
          {currentLogoUrl ? (
            <img src={currentLogoUrl} alt="Logo actuel" className="w-full h-full object-contain p-2" />
          ) : (
            <ImageIcon className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={onSelectFile} accept="image/*" className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Upload className="w-4 h-4" />
          <span>Changer le logo</span>
        </button>
      </div>

      {imgSrc && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-md font-semibold mb-2">Recadrer le nouveau logo</h3>
          <div className="flex justify-center bg-gray-200 p-4 rounded-md">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
            >
              <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '400px' }} alt="Recadrage" />
            </ReactCrop>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2 bg-go2skul-blue text-white rounded-lg text-sm font-medium hover:bg-go2skul-blue-700 disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Appliquer et Télécharger</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogoUploader
