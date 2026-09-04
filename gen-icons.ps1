Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap 512, 512
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# 底色填充 #F5F6F5
$rect = New-Object System.Drawing.Rectangle 0, 0, 512, 512
$cBg = [System.Drawing.Color]::FromArgb(245, 246, 245)
$bgBrush = New-Object System.Drawing.SolidBrush $cBg
$g.FillRectangle($bgBrush, $rect)

# 浅灰色爱心
$cHeart = [System.Drawing.Color]::FromArgb(200, 204, 200)
$heartBrush = New-Object System.Drawing.SolidBrush $cHeart
$heartPen = New-Object System.Drawing.Pen ($heartBrush, [float]4.5)
$heartPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$heartPath.AddBezier([float]256, [float]180, [float]242, [float]145, [float]200, [float]135, [float]175, [float]160)
$heartPath.AddBezier([float]175, [float]160, [float]145, [float]190, [float]155, [float]230, [float]256, [float]290)
$heartPath.AddBezier([float]256, [float]290, [float]357, [float]230, [float]367, [float]190, [float]337, [float]160)
$heartPath.AddBezier([float]337, [float]160, [float]312, [float]135, [float]270, [float]145, [float]256, [float]180)
$g.DrawPath($heartPen, $heartPath)

# 黑色火柴人
$cBlack = [System.Drawing.Color]::FromArgb(34, 36, 34)
$blackBrush = New-Object System.Drawing.SolidBrush $cBlack
$stickPen = New-Object System.Drawing.Pen ($blackBrush, [float]10.5)
$stickPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$stickPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

$headPen = New-Object System.Drawing.Pen ($blackBrush, [float]10.0)
$headBrush = New-Object System.Drawing.SolidBrush $cBg

# 火柴人 1 (左)
$g.FillEllipse($headBrush, 158, 193, 64, 64)
$g.DrawEllipse($headPen, 158, 193, 64, 64)
$g.DrawLine($stickPen, 190, 257, 190, 350)
$g.DrawLine($stickPen, 190, 285, 152, 335)
$g.DrawLine($stickPen, 190, 292, 256, 322)
$g.DrawLine($stickPen, 190, 350, 162, 425)
$g.DrawLine($stickPen, 190, 350, 208, 425)

# 火柴人 2 (右)
$g.FillEllipse($headBrush, 290, 193, 64, 64)
$g.DrawEllipse($headPen, 290, 193, 64, 64)
$g.DrawLine($stickPen, 322, 257, 322, 350)
$g.DrawLine($stickPen, 322, 292, 256, 322)
$g.DrawLine($stickPen, 322, 285, 360, 335)
$g.DrawLine($stickPen, 322, 350, 304, 425)
$g.DrawLine($stickPen, 322, 350, 350, 425)

# 牵手圆点
$g.FillEllipse($blackBrush, 250, 316, 12, 12)

$bmp.Save('assets/icons/apple-touch-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('assets/icons/phone-icon-192.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('assets/icons/phone-icon-512.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output 'EXACT_PERFECT_SUCCESS'
