from PIL import Image
import sys

def remove_white_bg(img_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # item is (R, G, B, A)
            r, g, b, a = item
            # Calculate distance to pure white
            dist_to_white = ((255-r)**2 + (255-g)**2 + (255-b)**2)**0.5
            
            if dist_to_white < 25: # Very close to white
                newData.append((255, 255, 255, 0))
            elif dist_to_white < 60: # Feathering edge
                alpha = int(((dist_to_white - 25) / 35) * 255)
                newData.append((r, g, b, alpha))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(img_path, "PNG")
        print(f"Processed {img_path}")
    except Exception as e:
        print(f"Error on {img_path}: {e}")

if __name__ == "__main__":
    for path in sys.argv[1:]:
        remove_white_bg(path)
