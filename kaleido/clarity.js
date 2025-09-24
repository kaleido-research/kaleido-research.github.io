$(window).on('load', function() {
    /**
     * Adjusts the width of a select element to fit its selected option's text.
     * @param {HTMLElement} selectElement - The select element to adjust.
     */
    function adjustWidth(selectElement) {
        const $select = $(selectElement);
        const selectedText = $select.find('option:selected').text();
        
        // Find the corresponding temporary element using the data attribute
        const tempId = $select.data('temp-id');
        if (!tempId) {
            console.error("Select element is missing a 'data-temp-id' attribute.", selectElement);
            return;
        }
        const $tempp = $('#' + tempId).find('p');
        
        // Set the text and measure the width
        $tempp.text(selectedText);
        const newWidth = $tempp.parent().width();
        
        // Apply the new width to the select element
        $select.width(newWidth);

        // Update the 3D model based on the selected options
        var label = $('#3d-selector1').val()
        var views = $('#3d-selector2').val()

        var model = document.getElementById('eschernet-3d');
        model.src = 'kaleido/gso3d/glbs/eschernet_' + views + '_compressed/' + label.toLowerCase() + '.glb'

        var model = document.getElementById('kaleido-3d');
        model.src = 'kaleido/gso3d/glbs/kaleido_' + views + '_compressed/' + label.toLowerCase() + '.glb'

        var model = document.getElementById('kaleido1024-3d');
        model.src = 'kaleido/gso3d/glbs/kaleido_1024_' + views + '_compressed/' + label.toLowerCase() + '.glb'

        var model = document.getElementById('gt-3d');
        model.src = 'kaleido/gso3d/glbs/gt_compressed/' + label.toLowerCase() + '.glb'

        // update the NeRF video based on the selected options
        var nerf_label = $('#nerf-selector1').val()
        var nerf_views = $('#nerf-selector2').val()

        var video = document.getElementById('insngp-nerf');
        video.src = 'kaleido/videos/multiview/nerf_synthetic/ingp/' + nerf_views.toLowerCase() + '_view/' + nerf_label + '.mp4'

        var video = document.getElementById('3dgs-nerf');
        video.src = 'kaleido/videos/multiview/nerf_synthetic/3dgs/' + nerf_views.toLowerCase() + '_view/' + nerf_label + '.mp4'

        var video = document.getElementById('eschernet-nerf');
        video.src = 'kaleido/videos/multiview/nerf_synthetic/eschernet/' + nerf_views.toLowerCase() + '_view/' + nerf_label + '.mp4'


        var video = document.getElementById('kaleido-nerf');
        video.src = 'kaleido/videos/multiview/nerf_synthetic/kaleido/' + nerf_views.toLowerCase() + '_view/' + nerf_label + '.mp4'

        var video = document.getElementById('gt-nerf');
        video.src = 'kaleido/videos/multiview/nerf_synthetic/gt/' + nerf_label + '.mp4'
    }

    // --- INITIALIZATION ---
    // Set the initial width for each adaptive selector on page load
    $('.adaptive-selector').each(function() {
        adjustWidth(this);
    });

    // --- EVENT LISTENER ---
    // Add a change event listener to update the width when an option is selected
    $('.adaptive-selector').on('change', function() {
        adjustWidth(this);
    });


});



// Multi-Video Gallery
document.addEventListener('DOMContentLoaded', () => {
const gallery = document.getElementById('video-gallery');
const mediaSource = document.getElementById('media-source');
const videoItems = Array.from(mediaSource.querySelectorAll('video'));

const targetRowHeight = 400;
const gap = 12;

function buildGallery() {
    gallery.innerHTML = '';
    if (videoItems.length === 0) return;
    const containerWidth = gallery.offsetWidth;

    const allRows = [];
    let currentRow = [];
    let currentRowWidth = 0;

    videoItems.forEach(video => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        const calculatedWidth = targetRowHeight * aspectRatio;
        currentRow.push(video);
        currentRowWidth += calculatedWidth;
        if (currentRowWidth + (currentRow.length - 1) * gap > containerWidth) {
            allRows.push(currentRow);
            currentRow = [];
            currentRowWidth = 0;
        }
    });
    if (currentRow.length > 0) allRows.push(currentRow);

    if (window.innerWidth > 768 && allRows.length > 1 && allRows[allRows.length - 1].length === 1) {
        const orphanRow = allRows.pop();
        allRows[allRows.length - 1].push(...orphanRow);
    }

    allRows.forEach((rowVideos, rowIndex) => {
        const isLastRow = rowIndex === allRows.length - 1;
        const rowElement = document.createElement('div');
        rowElement.className = 'media-row';

        if (!isLastRow) {
            let totalVideoWidth = 0;
            rowVideos.forEach(v => {
                totalVideoWidth += (v.videoWidth / v.videoHeight) * targetRowHeight;
            });
            const totalGapWidth = (rowVideos.length - 1) * gap;
            const newRowHeight = targetRowHeight * (containerWidth - totalGapWidth) / totalVideoWidth;
            rowVideos.forEach(rowVideo => {
                const wrapper = document.createElement('div');
                wrapper.className = 'media-wrapper';
                wrapper.style.flexBasis = `${newRowHeight * (rowVideo.videoWidth / rowVideo.videoHeight)}px`;
                wrapper.appendChild(rowVideo.cloneNode(true));
                rowElement.appendChild(wrapper);
            });
            rowElement.style.height = `${newRowHeight}px`;
        } else {
            rowVideos.forEach(rowVideo => {
                const wrapper = document.createElement('div');
                wrapper.className = 'media-wrapper';
                wrapper.style.width = `${targetRowHeight * (rowVideo.videoWidth / rowVideo.videoHeight)}px`;
                wrapper.style.height = `${targetRowHeight}px`;
                wrapper.appendChild(rowVideo.cloneNode(true));
                rowElement.appendChild(wrapper);
            });
        }
        gallery.appendChild(rowElement);
    });
}

const videoPromises = videoItems.map(video => new Promise((resolve, reject) => {
    if (video.readyState >= 1) { // Check if metadata is already loaded
        resolve(video);
    } else {
        video.addEventListener('loadedmetadata', () => resolve(video), { once: true });
        video.addEventListener('error', () => reject(new Error(`Failed to load ${video.currentSrc}`)), { once: true });
    }
}));

Promise.all(videoPromises).then(() => {
    buildGallery();
    new ResizeObserver(buildGallery).observe(gallery);
}).catch(console.error);
});
