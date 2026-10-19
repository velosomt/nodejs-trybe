Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$icoPath = Join-Path $root 'assets\curso.ico'

# Desenha o ícone: quadrado verde arredondado com "{ }"
$size = 256
$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAliasGridFit'
$g.Clear([System.Drawing.Color]::Transparent)

$r = 56
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc(8, 8, $r, $r, 180, 90)
$path.AddArc($size - 8 - $r, 8, $r, $r, 270, 90)
$path.AddArc($size - 8 - $r, $size - 8 - $r, $r, $r, 0, 90)
$path.AddArc(8, $size - 8 - $r, $r, $r, 90, 90)
$path.CloseFigure()
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Point 0, 0), (New-Object System.Drawing.Point $size, $size),
  [System.Drawing.Color]::FromArgb(255, 63, 185, 124), [System.Drawing.Color]::FromArgb(255, 8, 98, 64))
$g.FillPath($brush, $path)

$font = New-Object System.Drawing.Font('Consolas', 104, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = 'Center'
$fmt.LineAlignment = 'Center'
$g.DrawString('{ }', $font, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF 0, -14, $size, $size), $fmt)

$small = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('NODE', $small, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF 0, 150, $size, 80), $fmt)
$g.Dispose()

# Monta um .ico com o PNG embutido (formato aceito desde o Windows Vista)
$ms = New-Object System.IO.MemoryStream
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$png = $ms.ToArray()
$fs = [System.IO.File]::Create($icoPath)
$w = New-Object System.IO.BinaryWriter $fs
$w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]1)
$w.Write([byte]0); $w.Write([byte]0); $w.Write([byte]0); $w.Write([byte]0)
$w.Write([UInt16]1); $w.Write([UInt16]32)
$w.Write([UInt32]$png.Length); $w.Write([UInt32]22)
$w.Write($png)
$w.Close()

$desktop = [Environment]::GetFolderPath('Desktop')
$shell = New-Object -ComObject WScript.Shell
$lnk = $shell.CreateShortcut((Join-Path $desktop 'Curso Node.js (offline).lnk'))
$lnk.TargetPath = Join-Path $root 'index.html'
$lnk.WorkingDirectory = $root
$lnk.IconLocation = "$icoPath,0"
$lnk.Description = 'Curso Back-end em Node.js - Trybe (offline)'
$lnk.Save()

Write-Output "Atalho criado em: $desktop"
