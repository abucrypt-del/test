FROM nginx:alpine

# Copy app files to nginx default serving directory
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY kitchen.html /usr/share/nginx/html/
COPY al-yazi-mandi-logo.png /usr/share/nginx/html/
COPY al-yazi-mandi-logo-inverted.png /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# nginx runs by default
CMD ["nginx", "-g", "daemon off;"]
