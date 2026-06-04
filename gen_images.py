from PIL import Image, ImageDraw
W, H = 1200, 1500
def rr(d, box, r, **kw): d.rounded_rectangle(box, radius=r, **kw)

def make_plain():
    img = Image.new("RGB",(W,H),(22,22,24)); d=ImageDraw.Draw(img)
    g,g2=(52,52,56),(38,38,42); pad=90
    rr(d,[pad,70,W-pad,150],14,fill=(30,30,34))
    for x in [pad+30,pad+62,pad+94]: d.ellipse([x,100,x+18,118],fill=(60,60,66))
    rr(d,[pad+150,96,W-pad-40,124],8,fill=(44,44,48))
    rr(d,[pad,200,pad+180,230],6,fill=g)
    for i in range(4):
        x=W-pad-360+i*90; rr(d,[x,205,x+70,225],5,fill=g2)
    rr(d,[pad,280,W-pad,720],16,fill=(30,30,34))
    rr(d,[pad+60,380,pad+520,420],6,fill=g); rr(d,[pad+60,445,pad+420,475],6,fill=g2)
    rr(d,[pad+60,540,pad+260,590],8,outline=g,width=2)
    cols,gap=3,40; cw=(W-2*pad-(cols-1)*gap)//cols; y=800
    for r_ in range(2):
        for c in range(cols):
            x=pad+c*(cw+gap); rr(d,[x,y,x+cw,y+cw],12,fill=(30,30,34))
            rr(d,[x+20,y+cw-70,x+cw-80,y+cw-50],5,fill=g2); rr(d,[x+20,y+cw-40,x+120,y+cw-25],5,fill=g2)
        y+=cw+gap
    rr(d,[pad,H-120,W-pad,H-70],8,fill=(28,28,32)); return img

def make_premium():
    img=Image.new("RGB",(W,H),(10,10,11)); d=ImageDraw.Draw(img)
    gold,cream=(232,176,75),(244,242,237); pad=90
    glow=Image.new("RGB",(W,H),(10,10,11)); gd=ImageDraw.Draw(glow)
    for rad,al in [(620,28),(460,40),(300,55)]:
        gd.ellipse([W//2-rad,120-rad,W//2+rad,120+rad],fill=(al//2+18,al//2+12,18))
    img=Image.blend(img,glow,0.5); d=ImageDraw.Draw(img)
    rr(d,[pad,70,W-pad,150],14,fill=(20,20,24))
    for i,x in enumerate([pad+30,pad+62,pad+94]):
        d.ellipse([x,100,x+18,118],fill=[(232,90,72),(232,176,75),(120,200,120)][i])
    rr(d,[pad+150,96,W-pad-40,124],8,fill=(30,30,36))
    rr(d,[pad,198,pad+150,232],6,fill=cream)
    for i in range(3):
        x=W-pad-380+i*90; rr(d,[x,205,x+70,225],5,fill=(120,118,112))
    rr(d,[W-pad-90,198,W-pad,232],16,fill=gold)
    hero=Image.new("RGB",(W-2*pad,440),(0,0,0)); hd=ImageDraw.Draw(hero)
    for yy in range(440):
        t=yy/440; r=int(30+14*t); gg=int(24+6*(1-t)); b=int(18-4*t); hd.line([(0,yy),(W-2*pad,yy)],fill=(r,gg,b))
    img.paste(hero,(pad,280)); d=ImageDraw.Draw(img)
    rr(d,[pad+60,360,pad+620,430],8,fill=cream); rr(d,[pad+60,450,pad+560,510],8,fill=gold)
    rr(d,[pad+60,560,pad+300,615],10,fill=gold); rr(d,[pad+320,560,pad+540,615],10,outline=cream,width=2)
    cols,gap=3,40; cw=(W-2*pad-(cols-1)*gap)//cols; y=800
    pal=[(40,32,22),(34,26,34),(22,34,38),(38,28,22),(26,32,26),(34,30,40)]; k=0
    for r_ in range(2):
        for c in range(cols):
            x=pad+c*(cw+gap); rr(d,[x,y,x+cw,y+cw],12,fill=pal[k%6]); k+=1
            rr(d,[x+16,y+16,x+cw-16,y+cw-110],8,fill=(18,16,14))
            d.ellipse([x+cw//2-40,y+cw//2-90,x+cw//2+40,y+cw//2-10],outline=gold,width=3)
            rr(d,[x+20,y+cw-90,x+cw-100,y+cw-66],5,fill=cream); rr(d,[x+20,y+cw-56,x+140,y+cw-38],5,fill=gold)
            rr(d,[x+cw-70,y+cw-92,x+cw-20,y+cw-42],10,fill=gold)
        y+=cw+gap
    rr(d,[pad,H-120,W-pad,H-70],8,fill=(34,30,22)); rr(d,[pad+30,H-105,pad+200,H-85],5,fill=gold)
    return img

import os; os.makedirs("public",exist_ok=True)
make_plain().save("public/store_plain.png")
make_premium().save("public/store_premium.png")
print("images ready")
