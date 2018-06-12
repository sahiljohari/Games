import pygame
import time
import random

pygame.init()

display_width = 800
display_height = 600

fps = 30
white = (255,255,255)
black = (0,0,0)
red = (255,0,0)
green = (0,155,0)

direction = "right"

icon = pygame.image.load('Assets/appleImg.png')
img = pygame.image.load('Assets/snakehead.png')
appleimg = pygame.image.load('Assets/apple.png')

gameDisplay = pygame.display.set_mode((display_width,display_height))
pygame.display.set_caption('Snake')
pygame.display.set_icon(icon)

block_size = 10
AppleThickness = 20
snake_speed = 5
clock = pygame.time.Clock()

smallfont = pygame.font.SysFont('Trebuchet MS', 14)
medfont = pygame.font.SysFont('Trebuchet MS', 24)
largefont = pygame.font.SysFont('Trebuchet MS', 52)

def game_intro():
    intro = True

    while intro:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    intro = False
                if event.key == pygame.K_q:
                    pygame.quit()
                    quit()


        gameDisplay.fill(white)
        message_to_screen("Snake", green, -100, "large")
        message_to_screen("Eat the Red apples to grow as much as you can!", black, -30)
        message_to_screen("Make sure you do not to run into yourself, or the edges.", black, 10)
        message_to_screen("Press 'Space' to play/pause or 'Q' to quit", red, 50)

        pygame.display.update()
        clock.tick(30)

def snake(block_size, snakeList):
    if direction == "right":
        head = pygame.transform.rotate(img, 270)
    if direction == "left":
        head = pygame.transform.rotate(img, 90)
    if direction == "up":
        head = pygame.transform.rotate(img, 0)
    if direction == "down":
        head = pygame.transform.rotate(img, 180)

    gameDisplay.blit(head, (snakeList[-1][0], snakeList[-1][1]))
    for XnY in snakeList[:-1]:
        pygame.draw.rect(gameDisplay, green, [XnY[0],XnY[1],block_size,block_size])

def randAppleGen():
    randAppleX = round(random.randrange(0, display_width - AppleThickness) / 10.0) * 10.0
    randAppleY = round(random.randrange(0, display_height - AppleThickness) / 10.0) * 10.0

    return randAppleX, randAppleY

def pause():
    paused = True

    while paused:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    paused = False
                elif event.key == pygame.K_q:
                    pygame.quit()
                    quit()
        gameDisplay.fill(white)
        message_to_screen("Paused", black, -100, 'large')
        message_to_screen("Press 'Space' to continue or 'Q' to quit.", black, 25)

        pygame.display.update()
        clock.tick(5)

def Score(score):
    text = smallfont.render("Score: "+str(score), True, black)
    gameDisplay.blit(text, [0,0])

def text_objects(text, color, size):
    if size == "small":
        textSurface = smallfont.render(text, True, color)
    if size == "medium":
        textSurface = medfont.render(text, True, color)
    if size == "large":
        textSurface = largefont.render(text, True, color)
    return textSurface, textSurface.get_rect()
    
def message_to_screen(msg, color, y_displace=0, size = "small"):
    textSurf, textRect = text_objects(msg, color, size)
    textRect.center = (display_width / 2), (display_height / 2)+y_displace
    #screen_text = font.render(msg, True, color)
    #gameDisplay.blit(screen_text, [display_width / 2,display_height / 2])
    gameDisplay.blit(textSurf, textRect)
    
def gameLoop():
    global direction
    direction = "right"
    gameExit = False
    gameOver = False
    

    lead_x = display_width / 2
    lead_y = display_height / 2
    lead_x_change = 5
    lead_y_change = 0

    snakeList = []
    snakeLength = 1

    randAppleX, randAppleY = randAppleGen()
    
    while not gameExit:

        while gameOver == True:
            gameDisplay.fill(white)
            message_to_screen('Game Over!', red, -50, "medium")
            message_to_screen('Press C to play again or Q to quit', black, 50, "small")
            pygame.display.update()

            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q:
                        gameExit = True
                        gameOver = False
                    if event.key == pygame.K_c:
                        gameLoop()
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                gameExit = True
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT and direction != "right":
                    direction = "left"
                    lead_x_change = -snake_speed
                    lead_y_change = 0
                elif event.key == pygame.K_RIGHT and direction != "left":
                    direction = "right"
                    lead_x_change = snake_speed
                    lead_y_change = 0
                elif event.key == pygame.K_UP and direction != "down":
                    direction = "up"
                    lead_y_change = -snake_speed
                    lead_x_change = 0
                elif event.key == pygame.K_DOWN and direction != "up":
                    direction = "down"
                    lead_y_change = snake_speed
                    lead_x_change = 0
                elif event.key == pygame.K_SPACE:
                    pause()
            

        if lead_x >= display_width - block_size or lead_x < 0 or lead_y >= display_height - block_size or lead_y < 0:
            gameOver = True

        lead_x += lead_x_change
        lead_y += lead_y_change

        gameDisplay.fill(white)

        
        gameDisplay.blit(appleimg, (randAppleX, randAppleY))
        
        snakeHead = []
        snakeHead.append(lead_x)
        snakeHead.append(lead_y)
        snakeList.append(snakeHead)

        if len(snakeList) > snakeLength:
            del snakeList[0]

        for eachSegment in snakeList[:-1]:
            if eachSegment == snakeHead:
                gameOver = True

        snake(block_size, snakeList)

        Score(snakeLength-1)
        
        pygame.display.update()

        if lead_x > randAppleX and lead_x < randAppleX + AppleThickness or lead_x + block_size > randAppleX and lead_x + block_size < randAppleX + AppleThickness:
            if lead_y > randAppleY and lead_y < randAppleY + AppleThickness:
                randAppleX, randAppleY = randAppleGen()
                snakeLength += 1
            elif lead_y + block_size > randAppleY and lead_y + block_size < randAppleY + AppleThickness:
                randAppleX, randAppleY = randAppleGen()
                snakeLength += 1

        
        clock.tick(fps)  #setting the fps

    pygame.quit()
    quit()
    
game_intro()
gameLoop()