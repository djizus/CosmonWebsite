import os
from PIL import Image, ImageSequence
import subprocess  # Pour appeler FFmpeg depuis Python


def add_background_to_gif(gif_path, background_path, output_path, target_width_percentage):
    # Ouvrir l'image de fond et obtenir ses dimensions
    background = Image.open(background_path).convert("RGBA")
    bg_width, bg_height = background.size

    # Calculer la largeur cible du GIF basée sur le pourcentage de la largeur de l'arrière-plan
    target_width = int(bg_width * (target_width_percentage / 100))

    # Ouvrir le GIF
    gif = Image.open(gif_path)

    # Liste pour stocker les frames du GIF final
    frames = []

    # Parcourir chaque frame du GIF
    for frame in ImageSequence.Iterator(gif):
        # Convertir la frame en RGBA
        frame = frame.convert("RGBA")

        # Obtenir les dimensions de la frame
        frame_width, frame_height = frame.size

        # Calculer le nouveau ratio pour conserver les proportions
        ratio = target_width / frame_width
        new_height = int(frame_height * ratio)

        # Redimensionner la frame
        frame = frame.resize((target_width, new_height), Image.ANTIALIAS)

        # Calculer la position pour centrer la frame redimensionnée du GIF sur l'arrière-plan
        if "critical" in gif_path:
            x = -250
            y = 50
        else:
            x = (bg_width - target_width) // 2
            y = (bg_height - new_height) // 2

        # Créer une nouvelle image de fond pour cette frame pour conserver la taille de l'arrière-plan
        bg_copy = background.copy()

        # Coller la frame du GIF sur l'arrière-plan en utilisant la position calculée
        bg_copy.paste(frame, (x, y), frame)

        # Ajouter la frame modifiée à la liste
        frames.append(bg_copy)

    # Sauvegarder les frames comme un nouveau GIF
    frames[0].save(output_path, save_all=True, append_images=frames[1:], optimize=True, duration=gif.info['duration'],
                   loop=0)


def add_background_and_convert_to_video(gif_path, background_path, video_output_path, target_width_percentage):
    background = Image.open(background_path).convert("RGBA")
    gif = Image.open(gif_path)
    frames = []

    temp_frame_directory = "temp_frames"
    os.makedirs(temp_frame_directory, exist_ok=True)
    frame_filenames = []
    for i, frame in enumerate(ImageSequence.Iterator(gif)):
        frame = frame.convert("RGBA")
        ratio = target_width_percentage / 100.0
        new_width = int(background.width * ratio)
        ratio = new_width / frame.width
        new_height = int(frame.height * ratio)
        frame = frame.resize((new_width, new_height), Image.ANTIALIAS)

        x = (background.width - new_width) // 2
        y = (background.height - new_height) // 2

        bg_copy = background.copy()
        bg_copy.paste(frame, (x, y), frame)
        frame_path = os.path.join(temp_frame_directory, f"frame_{i:03d}.png")
        bg_copy.save(frame_path)
        frame_filenames.append(frame_path)

    ffmpeg_cmd = [
        'ffmpeg',
        '-framerate', '30',
        '-i', os.path.join(temp_frame_directory, 'frame_%03d.png'),
        '-c:v', 'libx264',
        '-profile:v', 'high',
        '-crf', '18',  # Lower CRF value means higher quality
        '-pix_fmt', 'yuv420p',
        video_output_path  # Assurez-vous que ceci est un fichier .mp4
    ]
    subprocess.run(ffmpeg_cmd)

    for frame_filename in frame_filenames:
        os.remove(frame_filename)
    os.rmdir(temp_frame_directory)


# Chemins vers les fichiers
parent_directory = './'
backgrounds = ["common.png", "uncommon.png", "rare.png", "epic.png", "legendary.png", "divinity.png"]

# Parcourir chaque sous-dossier dans le répertoire parent
for subdir in os.listdir(parent_directory):
    subdir_path = os.path.join(parent_directory, subdir)

    # S'assurer que c'est bien un dossier
    if os.path.isdir(subdir_path):
        # Parcourir chaque fichier dans le sous-dossier
        for filename in os.listdir(subdir_path):
            if filename.endswith('.gif'):
                # Construire le chemin complet du fichier GIF
                gif = os.path.join(subdir_path, filename)
                for background in backgrounds:
                    background_name = os.path.splitext(os.path.basename(background))[0]
                    output_dir = os.path.join(subdir_path, background_name)
                    # Créer le répertoire s'il n'existe pas
                    os.makedirs(output_dir, exist_ok=True)
                    gif_name = os.path.splitext(os.path.basename(gif))[0]
                    output_path = os.path.join(output_dir, gif_name + ".mp4")
                    # Appeler la fonction de traitement
                    # # 13 17 19 23 à revoir
                    if "idle" in gif_name:
                        add_background_and_convert_to_video(gif, background, output_path, 50)
                    elif "critical" in gif_name:
                        add_background_and_convert_to_video(gif, background, output_path, 130)
                    elif "defense" in gif_name:
                        add_background_and_convert_to_video(gif, background, output_path, 120)
                    elif "attack" in gif_name:
                        add_background_and_convert_to_video(gif, background, output_path, 80)
                    elif "dodge" in gif_name:
                        add_background_and_convert_to_video(gif, background, output_path, 80)
                    print(f"Traitement terminé : {gif} avec {background} -> {output_path}")

