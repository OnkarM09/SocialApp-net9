using System;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;
    public PhotoService(IOptions<CloudinarySettings> cloudinaryConfig)
    {
        var account = new Account(cloudinaryConfig.Value.ApiKey, cloudinaryConfig.Value.ApiKey, cloudinaryConfig.Value.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }
    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();
        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation()
                 .Height(500).Width(500).Crop("fill").Gravity("face"),
                Folder = "social-app"
            };
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }
        return uploadResult;
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deletionParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deletionParams);
        return result;
    }
}
