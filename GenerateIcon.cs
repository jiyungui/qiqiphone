using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

namespace IconGen
{
    public class Program
    {
        public static void Generate()
        {
            using (Bitmap bmp = new Bitmap(512, 512))
            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                // 纯白灰底色 #F5F6F5
                Color cBg = Color.FromArgb(245, 246, 245);
                using (SolidBrush bgBrush = new SolidBrush(cBg))
                {
                    g.FillRectangle(bgBrush, 0, 0, 512, 512);
                }

                // 爱心轮廓 #C8CCC8
                Color cHeart = Color.FromArgb(200, 204, 200);
                using (Pen heartPen = new Pen(cHeart, 4.5f))
                using (GraphicsPath heartPath = new GraphicsPath())
                {
                    heartPath.AddBezier(256f, 180f, 242f, 145f, 200f, 135f, 175f, 160f);
                    heartPath.AddBezier(175f, 160f, 145f, 190f, 155f, 230f, 256f, 290f);
                    heartPath.AddBezier(256f, 290f, 357f, 230f, 367f, 190f, 337f, 160f);
                    heartPath.AddBezier(337f, 160f, 312f, 135f, 270f, 145f, 256f, 180f);
                    g.DrawPath(heartPen, heartPath);
                }

                // 黑色火柴人笔刷
                Color cBlack = Color.FromArgb(34, 36, 34);
                using (Pen stickPen = new Pen(cBlack, 10.5f))
                using (Pen headPen = new Pen(cBlack, 10f))
                using (SolidBrush headFill = new SolidBrush(cBg))
                using (SolidBrush blackBrush = new SolidBrush(cBlack))
                {
                    stickPen.StartCap = LineCap.Round;
                    stickPen.EndCap = LineCap.Round;

                    // 火柴人 1 (左)
                    g.FillEllipse(headFill, 158, 193, 64, 64);
                    g.DrawEllipse(headPen, 158, 193, 64, 64);
                    g.DrawLine(stickPen, 190, 257, 190, 350);
                    g.DrawLine(stickPen, 190, 285, 152, 335);
                    g.DrawLine(stickPen, 190, 292, 256, 322);
                    g.DrawLine(stickPen, 190, 350, 162, 425);
                    g.DrawLine(stickPen, 190, 350, 208, 425);

                    // 火柴人 2 (右)
                    g.FillEllipse(headFill, 290, 193, 64, 64);
                    g.DrawEllipse(headPen, 290, 193, 64, 64);
                    g.DrawLine(stickPen, 322, 257, 322, 350);
                    g.DrawLine(stickPen, 322, 292, 256, 322);
                    g.DrawLine(stickPen, 322, 285, 360, 335);
                    g.DrawLine(stickPen, 322, 350, 304, 425);
                    g.DrawLine(stickPen, 322, 350, 350, 425);

                    // 牵手小圆点
                    g.FillEllipse(blackBrush, 250, 316, 12, 12);
                }

                bmp.Save("assets/icons/apple-touch-icon.png", ImageFormat.Png);
                bmp.Save("assets/icons/phone-icon-192.png", ImageFormat.Png);
                bmp.Save("assets/icons/phone-icon-512.png", ImageFormat.Png);
                Console.WriteLine("ALL_PNG_ICONS_GENERATED_SUCCESSFULLY");
            }
        }
    }
}
